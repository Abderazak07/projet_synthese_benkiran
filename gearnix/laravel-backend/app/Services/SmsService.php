<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $apiKey;
    protected $apiHost;
    protected $apiUrl;

    public function __construct()
    {
        $this->apiKey = env('RAPIDAPI_KEY');
        $this->apiHost = env('RAPIDAPI_HOST', 'messagebird-sms-gateway.p.rapidapi.com');
        $this->apiUrl = 'https://' . $this->apiHost . '/sms';
    }

    public function sendVerificationCode($phone, $code)
    {
        // Nettoyer le numéro : garder uniquement les chiffres pour MessageBird
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);

        // Si le numéro commence par 0, on assume Maroc (212)
        if (str_starts_with($cleanPhone, '0')) {
            $cleanPhone = '212' . substr($cleanPhone, 1);
        }

        try {
            Log::info('Tentative d\'envoi SMS MessageBird à : ' . $cleanPhone);

            $response = Http::asForm() // Indique application/x-www-form-urlencoded
                ->withHeaders([
                    'x-rapidapi-key' => $this->apiKey,
                    'x-rapidapi-host' => $this->apiHost,
                ])->post($this->apiUrl, [
                    'sender' => 'Gearnix',
                    'body' => 'Votre code de verification Gearnix est : ' . $code,
                    'destination' => $cleanPhone,
                    'type' => 'normal',
                ]);

            $status = $response->status();
            $body = $response->body();
            
            Log::info("Réponse MessageBird (Status $status): " . $body);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'error' => true,
                'message' => $response->json()['message'] ?? 'Erreur API inconnue',
                'status' => $status
            ];
        } catch (\Exception $e) {
            Log::error('MessageBird Service Exception: ' . $e->getMessage());
            return [
                'error' => true,
                'message' => 'Exception: ' . $e->getMessage()
            ];
        }
    }
}
