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
            'products' => Product::all()->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'category' => $p->category,
                'onHand' => $p->on_hand,
                'available' => $p->available,
                'reorderPoint' => $p->reorder_point,
                'maxStock' => $p->max_stock,
                'location' => $p->location,
                'velocity' => $p->velocity,
                'status' => $p->status,
                'supplier' => $p->supplier,
                'lastUpdated' => $p->updated_at->diffForHumans(),
            ]),
            'lots' => Lot::all()->map(fn ($lot) => [
                'id' => $lot->id,
                'productId' => $lot->product_id,
                'received' => $lot->received->format('Y-m-d'),
                'expires' => $lot->expires?->format('Y-m-d'),
                'quantity' => $lot->quantity,
                'location' => $lot->location,
                'state' => $lot->state,
            ]),
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
            'activity' => ActivityLog::with('user')->latest()->get()->map(fn ($log) => [
                'id' => $log->id,
                'event' => $log->event,
                'reference' => $log->reference,
                'person' => $log->user->name,
                'role' => $log->user->role,
                'time' => $log->created_at->diffForHumans(),
                'kind' => $log->kind,
            ]),
            'tasks' => PickTask::with('lot')->get()->map(fn ($task) => [
                'id' => $task->id,
                'order' => $task->order_number,
                'productId' => $task->product_id,
                'quantity' => $task->quantity,
                'lot' => $task->lot_id,
                'location' => $task->location,
                // pick_tasks has no expiry column of its own — it's derived from
                // the lot it points to, matching the display strings the
                // frontend originally hardcoded ("Sep 16, 2026" / "No expiry").
                'expiry' => $task->lot?->expires?->format('M j, Y') ?? 'No expiry',
                'priority' => $task->priority,
                'customer' => $task->customer,
                'dueInMinutes' => $task->due_in_minutes,
            ]),
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
