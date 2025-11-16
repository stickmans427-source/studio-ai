import { GoogleGenAI, Modality } from "@google/genai";
// FIX: Import VideoConfig type.
import { ImageConfig, VideoConfig } from '../types';

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:mime/type;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });

export const editImage = async (
  prompt: string,
  imageFile: File
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Image = await fileToBase64(imageFile);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: imageFile.type,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
  }

  throw new Error('Image generation failed. No image data found in response.');
};


export const generateImage = async (
  prompt: string,
  config: ImageConfig
): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: config.numberOfImages || 1,
          outputMimeType: 'image/png',
          aspectRatio: config.aspectRatio,
        },
    });

    return response.generatedImages.map(image => `data:image/png;base64,${image.image.imageBytes}`);
};

// FIX: Added missing generateVideo function.
export const generateVideo = async (
  prompt: string,
  config: VideoConfig,
  setProgressMessage: (message: string) => void,
  imageFile?: File
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  setProgressMessage('Initializing video generation...');

  const generationPayload: {
      model: string,
      prompt: string,
      image?: { imageBytes: string, mimeType: string },
      config: {
          numberOfVideos: number,
          resolution: string,
          aspectRatio: string
      }
  } = {
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: config.resolution,
      aspectRatio: config.aspectRatio,
    },
  };

  if (imageFile) {
    const base64Image = await fileToBase64(imageFile);
    generationPayload.image = {
      imageBytes: base64Image,
      mimeType: imageFile.type,
    };
  }

  let operation;
  try {
    operation = await ai.models.generateVideos(generationPayload);
  } catch (e: any) {
    if (e.message && e.message.includes('Requested entity was not found')) {
      throw new Error('API key is invalid. Please select a valid API key and try again.');
    }
    throw e;
  }
  

  setProgressMessage('Generation in progress... This can take several minutes.');
  
  const progressMessages = [
    'Warming up the AI dream engine...',
    'Assembling pixels into a narrative...',
    'Directing the digital actors...',
    'Rendering your cinematic vision...',
    'Applying the final touches of stardust...',
    'Your video is almost ready for its premiere!',
  ];
  let messageIndex = 0;

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
        setProgressMessage(progressMessages[messageIndex % progressMessages.length]);
        messageIndex++;
    } catch(e: any) {
        if (e.message && e.message.includes('Requested entity was not found')) {
            throw new Error('API key is invalid. Please select a valid API key and try again.');
        }
        throw e;
    }
  }

  if (operation.error) {
      throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error('Video generation failed. No download link found in the response.');
  }
  
  setProgressMessage('Downloading your video...');
  
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) {
    const errorText = await videoResponse.text();
    throw new Error(`Failed to download video. Status: ${videoResponse.statusText}. Details: ${errorText}`);
  }

  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};