<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\Lot;
use App\Models\PickTask;
use App\Models\Product;
use App\Models\ReorderRecommendation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Mirrors src/data.js exactly, so the seeded backend shows the same
     * demo data the frontend originally faked.
     *
     * All users share the placeholder password from the old demo login
     * ("warehouse2026") since data.js had no real per-user passwords.
     * Emails are invented (firstname.lastname@walangbrownout.test) — swap
     * these for real ones whenever you move past the demo phase.
     */
    public function run(): void
    {
        $users = [
            ['name' => 'Mark Nathan', 'initials' => 'MN', 'role' => 'Inventory Manager', 'email' => 'mark.nathan@walangbrownout.test'],
            ['name' => 'Rica Mae', 'initials' => 'RM', 'role' => 'Warehouse Staff', 'email' => 'rica.mae@walangbrownout.test'],
            ['name' => 'Karl Mark', 'initials' => 'KM', 'role' => 'Picking Staff', 'email' => 'karl.mark@walangbrownout.test'],
            ['name' => 'Belchez', 'initials' => 'BE', 'role' => 'Purchasing Manager', 'email' => 'belchez@walangbrownout.test'],
            ['name' => 'Kaye Xierhyl', 'initials' => 'KX', 'role' => 'Administrator', 'email' => 'kaye.xierhyl@walangbrownout.test'],
        ];

        $userModels = [];
        foreach ($users as $u) {
            $userModels[$u['name']] = User::create([
                'name' => $u['name'],
                'initials' => $u['initials'],
                'role' => $u['role'],
                'email' => $u['email'],
                'password' => Hash::make('warehouse2026'),
            ]);
        }

        $products = [
            ['id' => 'PAC-12000', 'name' => 'BreezePro 12,000 BTU Portable AC', 'category' => 'Portable AC', 'on_hand' => 74, 'available' => 68, 'reorder_point' => 90, 'max_stock' => 180, 'location' => 'A-04-12', 'velocity' => 'Seasonal', 'status' => 'Reorder now', 'supplier' => 'CoolHome Supply'],
            ['id' => 'APF-CARBON', 'name' => 'PureAir Carbon Filter', 'category' => 'Replacement Filter', 'on_hand' => 162, 'available' => 158, 'reorder_point' => 100, 'max_stock' => 260, 'location' => 'C-02-06', 'velocity' => 'Steady', 'status' => 'Expiry watch', 'supplier' => 'AirCare Trading'],
            ['id' => 'TH-X200', 'name' => 'ThermoLink X200 Smart Thermostat', 'category' => 'Smart Thermostat', 'on_hand' => 12, 'available' => 12, 'reorder_point' => 20, 'max_stock' => 75, 'location' => 'B-01-03', 'velocity' => 'Steady', 'status' => 'Critical', 'supplier' => 'HomeGrid Electronics'],
            ['id' => 'APR-500', 'name' => 'PureAir 500 Air Purifier', 'category' => 'Air Purifier', 'on_hand' => 98, 'available' => 98, 'reorder_point' => 40, 'max_stock' => 110, 'location' => 'D-03-02', 'velocity' => 'Steady', 'status' => 'Healthy', 'supplier' => 'AirCare Trading'],
            ['id' => 'PAC-9000', 'name' => 'BreezePro 9,000 BTU Portable AC', 'category' => 'Portable AC', 'on_hand' => 142, 'available' => 142, 'reorder_point' => 75, 'max_stock' => 165, 'location' => 'A-03-08', 'velocity' => 'Seasonal', 'status' => 'Healthy', 'supplier' => 'CoolHome Supply'],
        ];
        foreach ($products as $p) {
            Product::create($p);
        }

        $lots = [
            ['id' => 'F-0417', 'product_id' => 'APF-CARBON', 'received' => '2026-01-08', 'expires' => '2026-09-16', 'quantity' => 36, 'location' => 'C-02-06', 'state' => 'Pick first'],
            ['id' => 'F-0522', 'product_id' => 'APF-CARBON', 'received' => '2026-02-12', 'expires' => '2026-10-20', 'quantity' => 54, 'location' => 'C-02-07', 'state' => 'Queued'],
            ['id' => 'F-0614', 'product_id' => 'APF-CARBON', 'received' => '2026-03-16', 'expires' => '2026-11-24', 'quantity' => 72, 'location' => 'C-02-08', 'state' => 'Available'],
            ['id' => 'AC-8931', 'product_id' => 'PAC-12000', 'received' => '2026-04-28', 'expires' => null, 'quantity' => 74, 'location' => 'A-04-12', 'state' => 'Available'],
            ['id' => 'TH-2160', 'product_id' => 'TH-X200', 'received' => '2026-05-11', 'expires' => null, 'quantity' => 12, 'location' => 'B-01-03', 'state' => 'Available'],
        ];
        foreach ($lots as $l) {
            Lot::create($l);
        }

        $alerts = [
            ['type' => 'critical', 'product_id' => 'TH-X200', 'title' => 'ThermoLink X200 is below its reorder point', 'detail' => '12 available vs. reorder point of 20. The next supplier delivery takes 7 days.', 'action' => 'Create PO', 'action_target' => 'reorder', 'read' => false],
            ['type' => 'expiry', 'product_id' => 'APF-CARBON', 'title' => 'Filter lot F-0417 expires in 14 days', 'detail' => '36 PureAir Carbon Filters at C-02-06. FEFO priority has been raised.', 'action' => 'Flag for pick', 'action_target' => 'picking', 'read' => false],
            ['type' => 'seasonal', 'product_id' => 'PAC-12000', 'title' => 'Portable AC reorder window has opened', 'detail' => 'Peak season begins in 6 weeks. Suggested order is forecast-based and capped.', 'action' => 'Review forecast', 'action_target' => 'reorder', 'read' => false],
            ['type' => 'mismatch', 'product_id' => 'TH-X200', 'title' => 'Stock count review needed for ThermoLink X200', 'detail' => 'A cycle count is required after a reported shelf mismatch.', 'action' => 'View audit trail', 'action_target' => 'activity', 'read' => false],
            ['type' => 'overstock', 'product_id' => 'APR-500', 'title' => 'PureAir 500 Air Purifier is nearing max storage capacity', 'detail' => '98 available against a 110-unit cap at D-03-02. Hold off on the next PO until space frees up.', 'action' => 'Review inventory', 'action_target' => 'inventory', 'read' => false],
        ];
        foreach ($alerts as $a) {
            Alert::create($a);
        }

        $activity = [
            ['event' => 'Stock discrepancy reported', 'reference' => 'TH-X200', 'user' => 'Karl Mark', 'kind' => 'warning'],
            ['event' => 'Shipment received', 'reference' => 'F-0614 - 72 units', 'user' => 'Rica Mae', 'kind' => 'receive'],
            ['event' => 'FEFO pick completed', 'reference' => 'F-0417 - 8 units', 'user' => 'Karl Mark', 'kind' => 'pick'],
            ['event' => 'Reorder rule updated', 'reference' => 'PAC-12000 seasonal factor', 'user' => 'Belchez', 'kind' => 'settings'],
            ['event' => 'Purchase order created', 'reference' => 'PO-2026-0148', 'user' => 'Belchez', 'kind' => 'order'],
        ];
        foreach ($activity as $entry) {
            \App\Models\ActivityLog::create([
                'event' => $entry['event'],
                'reference' => $entry['reference'],
                'user_id' => $userModels[$entry['user']]->id,
                'kind' => $entry['kind'],
            ]);
        }

        $tasks = [
            ['id' => 'PK-1042', 'order_number' => 'SO-20481', 'product_id' => 'APF-CARBON', 'quantity' => 8, 'lot_id' => 'F-0417', 'location' => 'C-02-06', 'priority' => 'FEFO priority', 'customer' => 'HomePlus Retail', 'due_in_minutes' => 18],
            ['id' => 'PK-1043', 'order_number' => 'SO-20482', 'product_id' => 'PAC-12000', 'quantity' => 2, 'lot_id' => 'AC-8931', 'location' => 'A-04-12', 'priority' => 'Standard', 'customer' => 'Direct online order', 'due_in_minutes' => 32],
            ['id' => 'PK-1044', 'order_number' => 'SO-20483', 'product_id' => 'TH-X200', 'quantity' => 1, 'lot_id' => 'TH-2160', 'location' => 'B-01-03', 'priority' => 'Count check', 'customer' => 'Luna Home Systems', 'due_in_minutes' => 45],
        ];
        foreach ($tasks as $t) {
            PickTask::create($t);
        }

        $recommendations = [
            ['id' => 'PAC-12000', 'forecast' => 180, 'suggested_order' => 106, 'lead_time' => '14 days', 'rule' => 'Seasonal - 2.1x demand factor', 'status' => 'Act now', 'created' => false],
            ['id' => 'TH-X200', 'forecast' => 45, 'suggested_order' => 48, 'lead_time' => '7 days', 'rule' => 'Steady - demand + safety stock', 'status' => 'Act now', 'created' => false],
            ['id' => 'APF-CARBON', 'forecast' => 120, 'suggested_order' => 0, 'lead_time' => '10 days', 'rule' => 'Steady - healthy coverage', 'status' => 'Monitor', 'created' => false],
        ];
        foreach ($recommendations as $r) {
            ReorderRecommendation::create($r);
        }

        // No writeoffs — data.js's initialWriteoffs is an empty array.
    }
}
