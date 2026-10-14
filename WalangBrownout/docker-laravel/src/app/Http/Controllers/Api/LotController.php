<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Lot;
use App\Models\Writeoff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LotController extends Controller
{
    /**
     * POST /api/lots/{lot}/writeoff
     * Mirrors App.jsx's writeOffLot(lot, product, reason). Body: { reason }
     */
    public function writeOff(Request $request, Lot $lot)
    {
        $data = $request->validate(['reason' => 'required|string|max:255']);

        if ($lot->quantity <= 0) {
            return response()->json(['message' => 'Lot has no quantity to write off.'], 422);
        }

        return DB::transaction(function () use ($request, $lot, $data) {
            $product = $lot->product;
            $product->on_hand = max(0, $product->on_hand - $lot->quantity);
            $product->available = max(0, $product->available - $lot->quantity);
            $product->refreshStatus();
            $product->save();

            $writeoff = Writeoff::create([
                'lot_id' => $lot->id,
                'product_id' => $product->id,
                'quantity' => $lot->quantity,
                'reason' => $data['reason'],
                'date' => now()->toDateString(),
                'user_id' => $request->user()->id,
            ]);

            ActivityLog::create([
                'event' => 'Stock written off',
                'reference' => "{$lot->id} - {$lot->quantity} units ({$data['reason']})",
                'user_id' => $request->user()->id,
                'kind' => 'warning',
            ]);

            $lot->delete();

            return response()->json(['writeoff' => $writeoff]);
        });
    }
}
