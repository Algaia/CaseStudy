<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Lot;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReceivingController extends Controller
{
    /**
     * POST /api/receive
     * Mirrors App.jsx's receiveStock(receipt).
     * Body: { productId, quantity, lot, received, expires, location }
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'productId' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'lot' => 'required|string|max:50|unique:lots,id',
            'received' => 'required|date',
            'expires' => 'nullable|date',
            'location' => 'required|string|max:50',
        ]);

        return DB::transaction(function () use ($data, $request) {
            $product = Product::findOrFail($data['productId']);

            $product->on_hand += $data['quantity'];
            $product->available += $data['quantity'];
            $product->refreshStatus();
            $product->save();

            $lot = Lot::create([
                'id' => $data['lot'],
                'product_id' => $product->id,
                'received' => $data['received'],
                'expires' => $data['expires'] ?? null,
                'quantity' => $data['quantity'],
                'location' => $data['location'],
                'state' => 'Available',
            ]);

            ActivityLog::create([
                'event' => 'Shipment received',
                'reference' => "{$lot->id} - {$data['quantity']} units",
                'user_id' => $request->user()->id,
                'kind' => 'receive',
            ]);

            return response()->json(['product' => $product, 'lot' => $lot], 201);
        });
    }
}
