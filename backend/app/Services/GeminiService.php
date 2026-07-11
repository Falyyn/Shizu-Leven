<?php

namespace App\Services;

use GuzzleHttp\Client;

class GeminiService
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://generativelanguage.googleapis.com/v1beta/',
        ]);
        $this->apiKey = config('services.gemini.api_key');
    }

    public function askAssistant(string $prompt, array $inventoryData)
    {
        if (!$this->apiKey) {
            return "Gemini API key is not configured.";
        }

        $systemInstruction = "You are the Shizu Leven AI Inventory Assistant. Use the provided inventory data to answer queries.";
        $context = json_encode($inventoryData);

        // This is a simplified call to Gemini API for RAG
        // Real implementation would use the proper models/generateContent structure
        return "This is a mock response from Gemini Assistant regarding: " . substr($prompt, 0, 50);
    }
}
