<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Alert;
use App\Models\ReorderRecommendation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReorderController extends Controller
{
    /**
     * POST /api/reorder/{recommendation}/create-po
     * Mirrors App.jsx's createPurchaseOrder(id).
     */
    public function createPurchaseOrder(Request $request, ReorderRecommendation $recommendation)
    {
        if ($recommendation->created) {
            return response()->json(['message' => 'PO already created for this recommendation.'], 409);
        }

        return DB::transaction(function () use ($request, $recommendation) {
            // Matches the frontend's placeholder numbering scheme; swap for a real
            // sequence/table once this moves past the midterm scope.
            $poNumber = 'PO-2026-' . str_pad((string) (149 + ActivityLog::count()), 4, '0', STR_PAD_LEFT);

            $recommendation->created = true;
            $recommendation->save();

            Alert::where('product_id', $recommendation->id)->update(['read' => true]);

            ActivityLog::create([
                'event' => 'Purchase order created',
                'reference' => "{$poNumber} - {$recommendation->suggested_order} {$recommendation->id} units",
                'user_id' => $request->user()->id,
                'kind' => 'order',
            ]);

            return response()->json(['poNumber' => $poNumber, 'recommendation' => $recommendation]);
        });
    }
}
