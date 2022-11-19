/*
id - holds item id
int, str, agi, mastery, verse, crit, haste- shows 0 if stat is not present, 1 if stat is present on item
slot - holds slot the item is equiped to
type - holds tag for item
    armor - armor type (ie plate, cloth, leather)
    trinket - type of trinket
    weapon - type of weapon w/ stat modifier if applicable
*/
//var [] Items;

function Item() {
    this.id = 0;
    this.int = 0;
    this.str = 0;
    this.agi = 0;
    this.mastery = 0;
    this.verse = 0;
    this.crit = 0;
    this.haste = 0;
    this.slot = "";
    this.type = "";
}

$(document).ready(function () {
    var slots = ['head', 'shoulder', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet', 'neck', 'back', 'ring', 'weapon', 'trinket'];

    $.ajax({
        type: "get",
        url: "json/items.json",
        beforeSend: function () {
            //TODO rename id tag
            //$("#comparisontext").html("Loading...");
        },
        timeout: 10000,
        error: function (xhr, status, error) {
            alert("Error: " + xhr.status + " - " + error);
        },
        dataType: "json",
        success: function (data) {
            //TODO rename id tag
            $("#dungeonList").html("");
            //TODO rename id tag
            //dungeon List
            var dungeonCounter = 0;
            $.each(data, function () {
                var dungeonID = "";
                var bossID = "";
                var bossSlotID = "";
                //dungeonList
                $.each(this, function(key, dungeonList){
                    var bossCounter = 0;
                    dungeonID = dungeonCounter.toString();
                    var bossTableHTML = "<div class= 'dungeon' id= 'dungeon" + dungeonID + "'>" + dungeonList.dungeon_name;
                    $('#dungeonList').append(bossTableHTML);

                    //boss list
                    $.each(dungeonList.bosses, function (key2, bossList) {
                        bossID = bossCounter.toString();

                        bossTableHTML = "<div class='boss'><table><caption>" + bossList.name + "</caption><tr><th>Head</th><th>Shoulder</th><th>Chest</th><th>Wrist</th><th>Hands</th><th>Waist</th><th>Legs</th><th>Feet</th><th>Neck</th><th>Back</th><th>Rings</th><th>Weapon</th><th>Trinket</th></tr><tr>";

                        for (var k = 0; k < slots.length; k++) {
                            bossSlotID = dungeonID + "." + bossID + "." + slots[k];
                            bossTableHTML += "<tr id='" + bossSlotID + "'></tr>";
                        }   

                        bossTableHTML += "</tr></table></div><br>";
                        $("#dungeonList").append(bossTableHTML);

                        //item List
                        $.each(bossList.drops, function (key3, itemList) {
                            
                            bossSlotID = dungeonID + "." + bossID + "." + itemList.slot;
                            
                            var elem = document.getElementById(bossSlotID);

                            console.log(bossSlotID);

                            elem.append(
                                '<a id="' + itemList.id + '" href="https://www.wowhead.com/item=' + itemList.id +
                                ' data-wh-icon-added="true" class="q3" data-wh-rename-link="false">' +
                                '<span class="iconmedium" data-env="live" data-tree="live" data-game="wow" data-type="item">' +
                                '<ins style="background-image: url(&quot;' + itemList.imglink + '&quot;);"></ins><del></del></span></a>'
                            );
                            
                            
                            
                        });

                        bossCounter++;
                    });
                    
                    bossTableHTML = "</div>";
                    $("#dungeonList").append(bossTableHTML);
                    dungeonCounter++;
                });  
            });
        }
    });
});

                    /*
                    //dungeon list
                    for (var i = 0; i < data.dungeon.length; i++) {
                        //sets dungeon id respective to amount of dungeons
                        dungeonID = i.toString();

                        //boss list
                        for (var j = 0; j < data.dungeon[i].bosses.length; j++) {
                            //sets dungeon id respective to amount of bosses
                            bossID = j.toString();
                            var bossTableHTML = "<div class= 'dungeon' id= 'dungeon" + i.toString() + "'><div class='boss'><table><tr><th>Head</th><th>Shoulder</th><th>Chest</th><th>Wrist</th><th>Hands</th><th>Waist</th><th>Legs</th><th>Feet</th><th>Neck</th><th>Back</th><th>Rings</th><th>Weapon</th><th>Trinket</th></tr><tr>";

                            for (var k = 0; k < slots.length; k++) {
                                bossSlotID = dungeonID + "." + bossID + "." + slots[k];
                                bossTableHTML += "<tr id='" + bossSlotID + "'></tr>";
                            }

                            bossTableHTML += "</tr></table></div></div>";
                            $('#dungeonList').append(bossTableHTML);

                            //item list
                            for (var k = 0; k < data.dungeon[i].bosses[j].drops.length; k++) {

                                bossSlotID = "#" + dungeonID + "." + bossID + "." + data.dungeon[i].bosses[j].drops[k].slot;
                                //build wowhead links
                                //TODO implement dynamic id values to append to the correct td element
                                $(bossSlotID).append(
                                    '<a id="' + data.dungeon[i].bosses[j].drops[k].id + '" href="https://www.wowhead.com/item=' + data.dungeon[i].bosses[j].drops[k].id +
                                    ' data-wh-icon-added="true" class="q3" data-wh-rename-link="false">' +
                                    '<span class="iconmedium" data-env="live" data-tree="live" data-game="wow" data-type="item">' +
                                    '<ins style="background-image: url(&quot;' + data.dungeon[i].bosses[j].drops[k].imglink + '&quot;);"></ins><del></del></span></a>'
                                );
                            }
                        }
                    }
                });
            });
        },
        //On completeion, show the entry with index 0
        complete: function () {
        }
    }
});*/
