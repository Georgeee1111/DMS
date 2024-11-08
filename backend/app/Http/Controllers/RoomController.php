<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use DB;

class RoomController extends Controller
{
    public function getRoomStatistics()
    {
        $occupied = DB::table('rooms')->where('status', 'occupied')->count();
        $vacant = DB::table('rooms')->where('status', 'vacant')->count();
        $maintenance = DB::table('rooms')->where('status', 'maintenance')->count();

        return response()->json([
            'occupied' => $occupied,
            'vacant' => $vacant,
            'maintenance' => $maintenance,
        ]);
    }

    public function addRoom(Request $request)
    {
        // Validate incoming request data
        $validatedData = $request->validate([
            'room_number' => 'required|string|unique:rooms',
            'status' => 'required|in:occupied,vacant,maintenance',
            'capacity' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'floor' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        // Create a new room record
        $room = Room::create($validatedData);

        return response()->json([
            'message' => 'Room added successfully',
            'room' => $room,
        ], 201);
    }

    // Retrieve room by ID for editing
    public function editRoom($id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        return response()->json(['room' => $room]);
    }

    // Update room details
    public function updateRoom(Request $request, $id)
    {
        // Find room by ID
        $room = Room::find($id);

        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        // Validate incoming request data
        $validatedData = $request->validate([
            'room_number' => 'required|string|unique:rooms,room_number,' . $id,
            'status' => 'required|in:occupied,vacant,maintenance',
            'capacity' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'floor' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        // Update room with new data
        $room->update($validatedData);

        return response()->json([
            'message' => 'Room updated successfully',
            'room' => $room,
        ]);
    }

    public function deleteRoom($id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }
}
