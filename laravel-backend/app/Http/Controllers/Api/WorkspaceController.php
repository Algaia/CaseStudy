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
            'alerts' => Alert::latest()->get()->map(fn ($alert) => [
                'id' => $alert->id,
                'type' => $alert->type,
                'productId' => $alert->product_id,
                'title' => $alert->title,
                'detail' => $alert->detail,
                'time' => $alert->created_at->diffForHumans(),
                'action' => $alert->action,
                'actionTarget' => $alert->action_target,
                'read' => $alert->read,
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
