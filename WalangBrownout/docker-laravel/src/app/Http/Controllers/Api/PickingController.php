<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Alert;
use App\Models\PickTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PickingController extends Controller
{
    /**
     * POST /api/picks/{task}/complete
     * Mirrors App.jsx's completePick(task).
     */
    public function complete(Request $request, PickTask $task)
    {
        return DB::transaction(function () use ($request, $task) {
            $product = $task->product;
            $product->on_hand = max(0, $product->on_hand - $task->quantity);
            $product->available = max(0, $product->available - $task->quantity);
            $product->refreshStatus();
            $product->save();

            $lot = $task->lot;
            if ($lot) {
                $lot->quantity = max(0, $lot->quantity - $task->quantity);
                $lot->save();
            }

            if ($task->priority === 'FEFO priority') {
                Alert::where('type', 'expiry')->where('product_id', $product->id)->update(['read' => true]);
            }

            ActivityLog::create([
                'event' => 'FEFO pick completed',
                'reference' => "{$task->lot_id} - {$task->quantity} units",
                'user_id' => $request->user()->id,
                'kind' => 'pick',
            ]);

            $task->delete();

            return response()->json(['status' => 'completed']);
        });
    }

    /**
     * POST /api/picks/{task}/report-issue
     * Mirrors App.jsx's reportPickIssue(task). Task is NOT deleted here.
     */
    public function reportIssue(Request $request, PickTask $task)
    {
        ActivityLog::create([
            'event' => 'Pick issue reported',
            'reference' => $task->order_number,
            'user_id' => $request->user()->id,
            'kind' => 'warning',
        ]);

        return response()->json(['status' => 'reported']);
    }
}
