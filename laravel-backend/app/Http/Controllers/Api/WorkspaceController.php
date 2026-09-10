<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Lot;
use App\Models\PickTask;
use App\Models\Product;
use App\Models\ReorderRecommendation;
use App\Models\Writeoff;
use App\Models\ActivityLog;

class WorkspaceController extends Controller
{
    /**
     * GET /api/workspace
     * Mirrors fetchInventoryWorkspace() in src/api/fakeApi.js exactly —
     * same shape, so App.jsx's `setWorkspace(data)` needs no changes.
     */
    public function index()
    {
        return response()->json([
            'products' => Product::all(),
            'lots' => Lot::all(),
            'alerts' => Alert::latest()->get(),
            'activity' => ActivityLog::with('user')->latest()->get()->map(fn ($log) => [
                'id' => $log->id,
                'event' => $log->event,
                'reference' => $log->reference,
                'person' => $log->user->name,
                'role' => $log->user->role,
                'time' => $log->created_at->diffForHumans(),
                'kind' => $log->kind,
            ]),
            'tasks' => PickTask::all(),
            'recommendations' => ReorderRecommendation::with('product')->get()->map(fn ($rec) => [
                'id' => $rec->id,
                'product' => $rec->product->name,
                'onHand' => $rec->product->on_hand,
                'reorderPoint' => $rec->product->reorder_point,
                'forecast' => $rec->forecast,
                'suggestedOrder' => $rec->suggested_order,
                'leadTime' => $rec->lead_time,
                'rule' => $rec->rule,
                'status' => $rec->status,
                'created' => $rec->created,
            ]),
            'writeoffs' => Writeoff::all(),
        ]);
    }
}
