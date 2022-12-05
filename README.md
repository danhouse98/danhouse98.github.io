# Wow.Loot
Source code for a site that previews available gear that drops from M0s, Mythic+ and Raids in WoW-Dragonflight.

Item information is held in a JSON file that catagorizes the items by dungeon and boss, which is filled into appropriate tables using AJAX.

Current implementation allows for sorting by class/subclass, slot and stats.

·Class/Subclass Filter: dropdowns that allow for selection of a class and then the respective subclass you want to see loot for. If no subclass is chosen ALL items will be shown.

·Slot Filter: hides columns of the tables to allow for easier reading and sorting.

·Stat Filter: has a menu allowing for "and" and "or" sorting, to find items with ANY of the selected stats use "and"; to find items with ONLY the selected stats use "or". (Note trinkets with no secondary stat will not be shown with stat filtering, use Clear Filter to see these trinkets!)

This version is what is currently running, Vault of the Incarnates icons will be updated as soon as the Zamimg links are active.
