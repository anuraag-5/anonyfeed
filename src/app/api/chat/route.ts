import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai/index.mjs';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be seperated by '||'. These questions are for an anonymous social messaging platform and should be suitable for diverse audience. Avoid personal or sensitive topics , focusing instead on universal themes that encourage friendly interaction."
  
    const result = await streamText({
      model: openai('gpt-3.5-turbo-instruct'),
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if(error instanceof OpenAI.APIError){
      const { name , status , headers , message } = error
      return NextResponse.json({
        name , 
        status , 
        message ,
        headers
      },{status})
    }else{
      console.error("Unexpected error occured",error)
      throw error
    }
  }

  
}