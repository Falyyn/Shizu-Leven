<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Location;
use Illuminate\Http\Request;

class MasterDataController extends Controller
{
    public function index()
    {
        return response()->json([
            'categories' => Category::all(),
            'locations' => Location::all(),
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|unique:categories']);
        return response()->json(Category::create($validated));
    }

    public function storeLocation(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|unique:locations']);
        return response()->json(Location::create($validated));
    }

    public function destroyCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }

    public function destroyLocation($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();
        return response()->json(['message' => 'Location deleted']);
    }
}
