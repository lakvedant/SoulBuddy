// app/api/chat/route.ts
import { NextResponse } from 'next/server'

const CONFIG = {
  flowId: '59e5d967-c9a5-451f-846d-e7860c6ceca6',
  langflowId: '488d9a81-1c00-4c14-a50f-e429f0de2267',
  applicationToken: 'AstraCS:JkzCDyXZZYiuzgfBUoHNHjXU:3a842622241e5707fe475bcb6937d2419515f052be536e794e48270c48d6aa8c',
  baseURL: 'https://api.langflow.astra.datastax.com'
}

export async function POST(request: Request) {
  try {
    if (!CONFIG.applicationToken) {
      console.error('LANGFLOW_API_TOKEN is not set in environment variables');
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const { message } = await request.json();
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const endpoint = `/lf/${CONFIG.langflowId}/api/v1/run/${CONFIG.flowId}?stream=false`;
    const url = `${CONFIG.baseURL}${endpoint}`;
    
    console.log('Calling Langflow API:', {
      url,
      message,
      hasToken: !!CONFIG.applicationToken
    });

    const tweaks = {
      "ChatInput-5tvvI": {},
      "TextInput-mV8mM": {},
      "AstraDB-LPJjI": {},
      "OpenAIModel-cZz4M": {},
      "ChatOutput-KGvX2": {},
      "File-uW9i1": {},
      "SplitText-W0jSr": {},
      "CombineText-fpzVJ": {},
      "ParseData-aiYer": {}
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.applicationToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input_value: message,
        input_type: 'chat',
        output_type: 'chat',
        tweaks: tweaks
      })
    });

    const responseData = await response.json();
    console.log('Langflow API Response:', {
      status: response.status,
      ok: response.ok,
      data: responseData
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Langflow API error',
          details: responseData 
        },
        { status: response.status }
      );
    }

    if (responseData && responseData.outputs) {
      const output = responseData.outputs[0].outputs[0].outputs.message;
      return NextResponse.json({ response: output.message.text });
    }

    return NextResponse.json(
      { 
        error: 'Invalid API response format',
        details: responseData 
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error 
      },
      { status: 500 }
    );
  }
}