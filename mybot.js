//Test seed: 785282
//Ring test seed: 558738
//Method to home in on priority implemented.  Added fields for showing current priority location and fruit type.
//Also include display of nearest fruit location and type.  Add distance to each as well.
//Consider modding the html view and player.js file to highlight win/loss/tie status on fruit, or somehow provide indicators.
//With homing in on priority type, check if one type is particularly close and rate the capture in number of moves as well.  If too far
//and plenty of nearby low number captures, do those first.

//Cancel a move to if opponent is already hovering over current target and player bot is not hovering over current target.  Skip to next target of that type, or 
//if cannot win that type, mark it in priorities_listing as can't win.  The current algorithm then skips to the next fruit type.

//Check if can win a group in less moves than priority fruit from the group that currently contains the lowest number of fruit to win it.

//Clean up make_move and find_move functions.


//problem with freezing and not homing on correct target.

//---Global Variables-----------
var mybot_position_val_x = 1;//Test variable **DEBUG**
var mybot_position_val_y = 1;//Test variable **DEBUG**
var test_spot_has_item = 0;//Test variable **DEBUG**
var nodes_checked = new Array();//Contains an array of nodes that have been checked.
var nodes_to_check = new Array();//Contains an array of nodes that have to be checked still.
var default_move_direction = NORTH;
var move_to = -1;
var is_valid_move = true;
var priority_fruit_x_value = null;
var priority_fruit_y_value = null;
var priority_fruit_type_id = null;
var nearest_fruit_listing = new Array();//Contains an array of all the nearest fruit by number of moves.
var go_to_this_node_location = null;
var priorities_listing = null; //Contains a PrioritiesObject
var test_text_field = "none";//Text field used for testing output.
var error_message_field = "none";//Displays error message when error caught in algorithms.
var mybot_routing_algorithm_in_use = "none";//Displays the current routing algorithm being used by my bot;

//Fruit tracking
//Player bot fruits type, quantity, and if has over 50% of type.
//Opponent bot fruits type, quantity, and if has over 50% of type.
//Fruits remaining on field, by type, quantity, and if has over 50% of type.
//there will be anywhere between 3-5 item types.




//---------------------------------------------------



//----NodeDistObj Object-----
function nodeDistObj(x, y, distance_to_player) {
    this.x = x;
    this.y = y;
    this.player_distance_to_this_node = distance_to_player;//This is measured in moves horizontal and vertical.
}
//-------------------
function new_game() {
   test_spot_has_item = true;//On game resets to true so mybot moves

//Clear out all globals to prevent any leftovers
mybot_position_val_x = 1;//Test variable **DEBUG**
mybot_position_val_y = 1;//Test variable **DEBUG**
test_spot_has_item = 0;//Test variable **DEBUG**
nodes_checked = new Array();//Contains an array of nodes that have been checked.
nodes_to_check = new Array();//Contains an array of nodes that have to be checked still.
default_move_direction = NORTH;
move_to = -1;
is_valid_move = true;
priority_fruit_x_value = null;
priority_fruit_y_value = null;
priority_fruit_type_id = null;
nearest_fruit_listing = new Array();//Contains an array of all the nearest fruit by number of moves.
go_to_this_node_location = null;
priorities_listing = null; //Contains a PrioritiesObject
test_text_field = "none";//Text field used for testing output.
error_message_field = "none";//Displays error message when error caught in algorithms.
}




function make_move() {
  var board = get_board();

  //Get information
  var my_x = get_my_x();
  var my_y = get_my_y();
  mybot_position_val_x = get_my_x();// **DEBUG** Test variable
  mybot_position_val_y = get_my_y();// **DEBUG** Test variable




/*
//--------Move to priority, but stop to pick up other fruit if along pathway------
  // we found an item! take it!
  if (board[get_my_x()][get_my_y()] > 0) {
     return TAKE;
  }
  else if (board[get_my_x()][get_my_y()] <= 0){
    var move = find_move();

    //Issue which direction to move
    if (move !== null)
      return move;
    else
      return PASS;
  }
//----------------------------------------------------------------------------
*/

  //-------------Priority target only mode--------------
  //If we are on the priority location and there is fruit, take, otherwise move
  if (my_x === priority_fruit_x_value && my_y === priority_fruit_y_value && board[get_my_x()][get_my_y()] > 0){
    return TAKE;
  }
  else{
    var move = find_move();
    //test_text_field = priorities_listing.check_win_status_for_item_type_if_a_bot_gained_this_amount(2, 2, 2);
    if (move !== null){
      return move;
    }
    else{
      return PASS ;
    }
  }
  //-------------------------------------------------  



}

/*
//---------------------------OLD FUNCTION Column scan--------------------------------------
//pass in a node with x and y position info
function consider_move_column_scan(position) {
   //var x_position_coord = 0;
   //var y_position_coord = 0;

   var my_x = get_my_x();
   var my_y = get_my_y();
   mybot_position_val_x = get_my_x();// **DEBUG** Test variable
   mybot_position_val_y = get_my_y();// **DEBUG** Test variable
   var board = get_board();

   //searches through current player column to find if there is any fruit.
   for (var i = 0 ; i < HEIGHT; i ++){
      if (has_item(board[mybot_position_val_x][i])){
         test_spot_has_item = true;
         return true;
      }
      else
         test_spot_has_item = false;
   }
   //If all cases of testing the row turns out to be false, then we return a false, indicating that we
   // did not find any fruit within that search row/column.
   return false;
}
//------------------------------OLD FUNCTION END------------------------------------
*/


//Check the surrounding blocks to bot.  Begin at 1 move distance.
function find_move(){
  var my_x = get_my_x();
  var my_y = get_my_y();





  //-----Home in on Priority Fruit Algorithm------
  //---------------Scan for nearest fruit-----------------------------------------  
  //Scan for nearest fruit on map
  scan_block_area(0,WIDTH-1,0,HEIGHT-1);//Scans entire map and updates the array for 'nearest_fruit_listing'.
  //Sorts list for nearest fruit
  sort_nearest_fruit_listing();
  //find fruit type priority, then find nearest of that type and home in on it. 
  var priority_fruit_type = findPriorityFruitType();
  var location_node_of_nearest_priority_fruit = findNearestPriorityFruitLocation();
  
  //Check if location_node_of_nearest_priority_fruit === null
  //moves bot towards nearest fruit location with priority.
  var priority_fruit_x = null;
  var priority_fruit_y = null;
  
  if (location_node_of_nearest_priority_fruit !== null){
    priority_fruit_x = location_node_of_nearest_priority_fruit.x;
    priority_fruit_y = location_node_of_nearest_priority_fruit.y;

    //Checks if opponent already on this spot and player bot is not.  If so, ignore, since if player is not already there
    //can't get a share of the fruit.  Determine if category still undetermined.  Recaculate route.
      //checking if opponent on this spot.
      var opponent_is_on_target_already = checkIfOpponentOnLocation(priority_fruit_x, priority_fruit_y);
      //checking if player is on this spot.
      var my_bot_is_on_target_already = checkIfPlayerOnLocation(priority_fruit_x, priority_fruit_y);
      var opponent_will_capture_before_player = false;
      if (opponent_is_on_target_already && !my_bot_is_on_target_already){
        opponent_will_capture_before_player = true;
      }

      //Case when opponent will capture the fruit before the player bot does
      //---
      //***CONINTUE FROM HERE****
      //count opponent as having taken that fruit by preemtively updating the status chart.
      var status_on_item_type_if_opponent_takes = priorities_listing.check_win_status_for_item_type_if_a_bot_gained_this_amount(priority_fruit_type, 1, 1);
      //if category still undetermined
      if (status_on_item_type_if_opponent_takes === "undetermined"){
        //Check next nearest location of current priority fruit.
        findNearestPriorityFruitLocation(2);
      }
      //If anything else, give up on that fruit type, and set the 'priority_fruit_type' to the next one.  Do this by modifying the fruit status to the
      //return value;
      priorities_listing.win_status_for_item_types[priority_fruit_type] = status_on_item_type_if_opponent_takes;
      //reinvoke findPriorityFruitType();
      priority_fruit_type = findPriorityFruitType();
      //find the new location node and assign.
      location_node_of_nearest_priority_fruit = findNearestPriorityFruitLocation();
      // get and assign values to priority_fruit x and y.
      if (location_node_of_nearest_priority_fruit !== null){
        priority_fruit_x = location_node_of_nearest_priority_fruit.x;
        priority_fruit_y = location_node_of_nearest_priority_fruit.y;
      }


    //***UPDATES the priority fruit location and id values
    priority_fruit_x_value = priority_fruit_x;
    priority_fruit_y_value = priority_fruit_y;
    priority_fruit_type_id = priority_fruit_type;
  }

  if (location_node_of_nearest_priority_fruit !== null){
    move_to = route_bot_to_go_to_location(priority_fruit_x, priority_fruit_y);
    mybot_routing_algorithm_in_use = "Priority Fruit";
    return move_to;
  }
  //-------------End Home in on Priority Fruit Algorithm----



  //Else if we did not find a priority fruit because value was null go to nearest fruit instead.
  //Gets the x and y coordinate of this fruit


  //Check adjacent blocks to player to see if there is more than 1 
  //fruit adjacent within 1 move distance.
  if (is_there_more_than_1_adjacent_fruit(my_x,my_y)){
    move_to = determine_direction_when_more_than_one_adjacent_fruit(my_x, my_y);
    return move_to;
  }
  //If none adjacent, resorts to the 'nearest_fruit_listing'.
  var go_to_x = nearest_fruit_listing[0].x;
  var go_to_y = nearest_fruit_listing[0].y;

  //moves bot in direction towards specified location
  move_to = route_bot_to_go_to_location(go_to_x,go_to_y);

  if (move_to !== -1){
    mybot_routing_algorithm_in_use = "nearest fruit";
    return move_to;
  }


  //In case no blocks have fruit, increase search distance by 1 each cycle
  //while (move_to < 0)
  {
    //Place radial scan algorithm here.  Phase 1 will just home in on nearest. Phase 2 will add in density valuation.
  }




  //If time about to run out.
  //Move bot in case no moves decided.  
  //Check for block valid, else move to next choice.
  
  //----------DEFAULT MOVE DIRECTION PICKER--------------------------
  //Default moves if no decision made
  //If move in that direction cannot be moved to, changes the default
  //move direction.
  mybot_routing_algorithm_in_use = "random move (something is wrong)";
  if (move_to === -1){
    if (default_move_direction == NORTH)
      if (isValidMove(my_x,my_y-1)){
        return NORTH;
      }
      else{
        is_valid_move = false;
        getNewDefaultDirection();
        return default_move_direction;
      }
    if (default_move_direction == EAST){
      if (isValidMove(my_x+1,my_y))
        return EAST;
      else{
        getNewDefaultDirection();
        return default_move_direction;
      }
    }
    if (default_move_direction == SOUTH){
      if (isValidMove(my_x,my_y+1))
        return SOUTH;
      else{
        getNewDefaultDirection();
        return default_move_direction;
      }
    }
    if (default_move_direction == WEST){
      if (isValidMove(my_x-1,my_y))
      return WEST;
      else{
        getNewDefaultDirection();
        return default_move_direction;
      }
    }


  }

  else
    return move_to;
}

function getNewDefaultDirection(){

  //Assign new direction at random to move to
  var rand = Math.random() * 4;

  if (rand < 1) default_move_direction = NORTH;
  else if (rand < 2) default_move_direction = SOUTH;
  else if (rand < 3) default_move_direction = EAST;
  else if (rand < 4) default_move_direction = WEST;

  return default_move_direction;

}

//Check in North, East, South, West positioning around designated position
function checkNESW(x,y){
  var board = get_board();
  //Check North of position
  if (isValidMove(x,y-1)){
    if (has_item(board[x][y-1])){
      return NORTH;
    }
  }
  //Check East of position
  if (isValidMove(x+1,y)){
    if (has_item(board[x+1][y])){
      return EAST;
    }
  }
  //Check South of position
  if (isValidMove(x,y+1)){
    if (has_item(board[x][y+1])){
      return SOUTH;
    }
  }
  //Check West of position
  if (isValidMove(x-1,y)){
    if (has_item(board[x-1][y])){
      return WEST;
    }
  }

  //None found
  return -1;
}

function considerMoveValid(x,y){
  if (!isValidMove(x, y)) return false;
  if (nodes_checked[x][y] > 0) return false;
  nodes_checked[x][y] = 1;
  return true;
}

//Checks of position is a valid location to move into.
function isValidMove(x, y) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT)
      return false;
  return true;
}


//---------------------Determine fruit hotzones that have high fruit density---------------------------

//scan a zone to determine fruit density.  Input an x and y coordinate.
//Returns the decimal value of fruit present/total squares within the scan area.
//We can then associate this value with a particular origin square, the radius, and the density value.
function scan_fruit_density(radius, coordinate_x, coordinate_y){

}

//Update area fruit density listing
//Updates the list of fruit density by running the 'scan_fruit_density' function for
//each grid location.  
//-----------------------------------------------------------------------------------------------------

//-------------------Ring Scan for Nearest Fruit-------------------------------------------
//Will scan a ring area from the center.  Diagonals are included.  Thus a 1 distance will
//count in the diagonal position, which will take a move distance of 2.  Since all positions
//will have a move distance associated with them, we will still be able to sort out which object is closest.
//We will begin by picking the 12 o clock position, and check clockwise around the ring.
//If none found, expands search radius and repeats.  Clears out the 'nearest_fruit_listing' array
//each time this is called so that we have a fresh list and remove stale data entries.
function ring_scan(distance_from_center_to_north_position, central_coordinate_x, central_coordinate_y){
  nearest_fruit_listing.length = 0; //**DEBUG***CLEAR FRUIT LISTING  
  var move_distance = 0;
  var my_x = central_coordinate_x;
  var my_y = central_coordinate_y;
  var ring_distance = distance_from_center_to_north_position;


  //Determine max North, East, South, West positions possible using the straight distance limit if we generated
  //a radius from the center to the cardinal directions and diagonals with the specified distance.  These boundaries
  //would be my_position - distance, and my_position + distance for the x and y coordinates.  Both x and y values can
  //be set to the min or max simultaneously.  
  // x x x
  // x p x
  // x x x
  //Scan ring looks like above around the player at 1 distance.  8 blocks to scan.  At 2 distance, would be the full 
  //ring, and be a 5x5 grid minus the center.  Excluding the 1 distance ring, the second ring will be 16 blocks to scan.

  check_all_ring_position(ring_distance, my_x, my_y);

  return true;
}

//Check if location has fruit.  Returns true if has fruit, otherwise returns false.
function does_position_have_fruit(check_position_x, check_position_y){
  var board = get_board();
  if (isValidMove(check_position_x , check_position_y)){
    if (has_item(board[check_position_x][check_position_y])){
      return true;
    }
    else
      return false;
  }
  else
    return false;
}

//Check block for fruit and push to fruit listing if fruit is found on that block
//which includes the position and distance of player bot to that fruit.
//Returns 0 if no fruit found or invalid block, returns 1 if fruit found on block.
function check_position_for_fruit_and_add_to_list(check_position_x, check_position_y){
  var move_distance = 0;
  var my_x = get_my_x();
  var my_y = get_my_y();
  var board = get_board();//Board data.

  if (isValidMove(check_position_x , check_position_y)){
    if (has_item(board[check_position_x][check_position_y])){
      
      //Calculates distance from one position to another position
      move_distance = calculateDistanceAtoB(my_x , my_y , check_position_x , check_position_y);

      //Create a node with position and move distance to reach.  Add this to the list
      nearest_fruit_listing.push(new nodeDistObj(check_position_x, check_position_y, move_distance));
      return 1;
    }
    else
      return 0;
  }
  else
    return 0;
}

//Checks all ring positions for fruit.  Any position with fruit gets added to the 'nearest_fruit_listing' array.
function check_all_ring_position(ring_distance_input, my_x_input, my_y_input){
  //Needs to contain the current checking position and needs to advance the position around the ring.
  //At each location that we check for fruit, we invoke the 'check_position_for_fruit_and_add_to_list' method.
  //When the position returns to the 12 o clock position, we terminate the loop.

  var my_x = my_x_input;
  var my_y = my_y_input;
  var ring_distance = ring_distance_input;
  var looped_ring_once = false;
  var check_position_x = null;
  var check_position_y = null;
  //Stores the starting 12 o clock position.
  var beginning_position_x = my_x;
  var beginning_position_y = my_y - ring_distance;

  //Make check_position = beginning_position
  check_position_x = beginning_position_x;
  check_position_y = beginning_position_y;

  //check the 12 o clock position is valid block
  if (isValidMove(check_position_x, check_position_y)){
    //check for fruit and if found push to fruit list
    check_position_for_fruit_and_add_to_list(check_position_x, check_position_y);
  }


  //then

  var next_position_node;
  while (looped_ring_once === false){
    next_position_node = find_next_ring_position(ring_distance, my_x, my_y, check_position_x, check_position_y);
    if (next_position_node === null){
      error_message_field = "unable to find next ring position.";
      break;
    }
    //update to the next position
    check_position_x = next_position_node.x;
    check_position_y = next_position_node.y;
    if (check_position_x == beginning_position_x && check_position_y == beginning_position_y)
      looped_ring_once = true;
    //if entire ring not checked yet, check the current position for fruit.
    else
      check_position_for_fruit_and_add_to_list(check_position_x, check_position_y);

  }
  
  //begin by advancing to the next position
  //check if block is 12 o clock position,  if so, mark 'looped_ring_once = true'
  //check if block is valid
  //if block is valid, check for fruit

  //once ring positions are all checked, we should have a list of all fruit available within that ring.
  


  return true;
}

//Checks on other locations within same ring.
//Advance position clockwise.  If we hit corner positions, changes the position to follow clockwise pattern.
function find_next_ring_position(ring_distance_input, my_x_input, my_y_input, current_position_x_input, current_position_y_input){
  var my_x = my_x_input;
  var my_y = my_y_input;
  var my_position_node = new node(my_x, my_y, "ringnode");
  var ring_distance = ring_distance_input;
  var current_position_x = current_position_x_input;
  var current_position_y = current_position_y_input;
  var ring_position_node = new node(current_position_x, current_position_y, "ringnode");

  //Determine maximum bound North, South, East, and West
  var northern_side_y = my_y - ring_distance;
  var southern_side_y = my_y + ring_distance;
  var eastern_side_x = my_x + ring_distance;
  var western_side_x = my_x - ring_distance;

  //Determine 4 corner pivot positions where advancement direction changes.
  var corner_north_east = new node(eastern_side_x, northern_side_y, "ringnode");
  var corner_south_east = new node(eastern_side_x, southern_side_y, "ringnode");
  var corner_south_west = new node(western_side_x, southern_side_y, "ringnode");
  var corner_north_west = new node(western_side_x, northern_side_y, "ringnode");

  //Determine which of the 4 advancement schemes apply.
  //Since we only process clockwise, we can determine that if we are on a corner, we must
  //continue the clockwise pattern.  Additionally, if we know which side of the square we are on
  //we can determine the direction to advance.

  var next_position_x = null;
  var next_position_y = null;

  //We determine movement based on which side the current position is on and check next condition of we are on the turning corner.
  //We also check if the location is within map bounds.
  var current_position_within_ring_bounds = location_is_within_bounds(current_position_x, current_position_y, western_side_x, eastern_side_x,
    northern_side_y, southern_side_y);
  //Move East
  //moves east if current_position_y == northern_side_y && (ring_position_node x and y != corner_north_east node x and y)
  //Assign 'next_position_x' and 'next_position_y'.
  if (current_position_y == northern_side_y && ring_position_node.x != eastern_side_x && current_position_within_ring_bounds){
    next_position_x = current_position_x + 1;
    next_position_y = current_position_y;
  }
    
  //Move South
  //moves south if current_position_x == eastern_side_x && (ring_position_node x and y != corner_south_east node x and y)
  //Assign 'next_position_x' and 'next_position_y'.
  else if (current_position_x == eastern_side_x && ring_position_node.y != southern_side_y && current_position_within_ring_bounds ){
    next_position_x = current_position_x;
    next_position_y = current_position_y + 1;
  }

  //Move West
  //moves west if current_position_y == southern_side_y && (ring_position_node x and y != corner_south_west node x and y)
  //Assign 'next_position_x' and 'next_position_y'.
  else if (current_position_y == southern_side_y && ring_position_node.x != western_side_x && current_position_within_ring_bounds ){
    next_position_x = current_position_x - 1;
    next_position_y = current_position_y;
  }

  //Move North
  //moves north if current_position_x == western_side_x && (ring_position_node x and y != corner_north_west node x and y)
  //Assign 'next_position_x' and 'next_position_y'.
  else if (current_position_x == western_side_x && ring_position_node.y != northern_side_y && current_position_within_ring_bounds ){
    next_position_x = current_position_x;
    next_position_y = current_position_y - 1;
  }
  //If input for current position does not match where the expected check locations are
  //will toss an error message to the position locations.
    else{
    next_position_x = "error current ring position not in expected range. Check 'find_next_ring_position' inputs.";
    next_position_y = "error current ring position not in expected range. Check 'find_next_ring_position' inputs.";
  }

 
  //Advances position by determined advancement scheme and returning that node containing x, and y position.
  var next_position = new node(next_position_x,next_position_y,"ringnode");
  return next_position;
}



//Check if location is within specified boundaries.
function location_is_within_bounds(location_x, location_y, boundary_x_min, boundary_x_max, boundary_y_min, boundary_y_max){
  if (location_x >= boundary_x_min && location_x <= boundary_x_max && location_y >= boundary_y_min && location_y <= boundary_y_max)
    return true;
  else
    return false;
}










//------------------------------------------------------------------------------------------


//----------------Directional Scan for fruit quantity------------------------
//Inputs the direction of the scan NORTH, EAST, SOUTH, WEST relative to 
//the position of the player bot.
function scanDirection(direction_of_scan){

  
  mybot_position_val_x = get_my_x();// **DEBUG** Test variable
  mybot_position_val_y = get_my_y();// **DEBUG** Test variable

  //searches row in front of player by specified direction.  Progresses row by row scanning
  //for fruit.
  

  var board = get_board();
  var fruit_count = 0;

  if (direction_of_scan == NORTH){
    for (j = (mybot_position_val_y-1); j >= 0 ; j--){
      for (i = 0; i < WIDTH ; i++)
      {
        if (has_item(board[i][j])){
          fruit_count++;
        }
      }
    }
  }

  if (direction_of_scan == EAST){
    for (i = (mybot_position_val_x+1); i < WIDTH ; i++){
      for (j = 0; j < HEIGHT ; j++)
      {
        if (has_item(board[i][j])){
          fruit_count++;
        }
      }
    }
  }

  if (direction_of_scan == SOUTH){
    for (j = (mybot_position_val_y+1); j < HEIGHT ; j++){
      for (i = 0; i < WIDTH ; i++)
      {
        if (has_item(board[i][j])){
          fruit_count++;
        }
      }
    }
  }

  if (direction_of_scan == WEST){
    for (i = (mybot_position_val_x-1); i >= 0 ; i--){
      for (j = 0; j < HEIGHT ; j++)
      {
        if (has_item(board[i][j])){
          fruit_count++;
        }
      }
    }
  }
  return fruit_count;


  
}
//---------Calculates Distance from one position to another----------------
function calculateDistanceAtoB(positionA_x , positionA_y , positionB_x , positionB_y){
  var distanceAtoB = 0;
  var x_axis_distance = 0;
  var y_axis_distance = 0;

  x_axis_distance = Math.abs(positionA_x - positionB_x);
  y_axis_distance = Math.abs(positionA_y - positionB_y);

  distanceAtoB = x_axis_distance + y_axis_distance;

  return distanceAtoB;
}

//-------------------------------------------------------------------------


//-------------------Sort nearest_fruit_listing ------------------------
function sort_nearest_fruit_listing(){

  //Sorts in ascending order all fruits listed in the 'nearest_fruit_listing'.
  nearest_fruit_listing.sort(function(a,b){return a.player_distance_to_this_node - b.player_distance_to_this_node;});

  return true;

}

//---------------------------------------------------------------------

//Scan map by specifying bounds and dump all fruits found into the nearest_fruit_listing
//by using the 'check_position_for_fruit_and_add_to_list() method.  Clears the 'nearest_fruit_listing' array before new scan.
function scan_block_area(bound_x_min, bound_x_max, bound_y_min, bound_y_max){

  nearest_fruit_listing.length = 0; //**DEBUG***CLEAR FRUIT LISTING
  for (var x = bound_x_min ; x <= bound_x_max ; x++)
    for (var y = bound_y_min ; y <= bound_y_max ; y++){
      if (isValidMove(x , y)){

        check_position_for_fruit_and_add_to_list(x,y);
      }
    }
  return true;
}


//Route bot to nearest fruit stored in go_to_location
function route_bot_to_go_to_location(position_x, position_y){
  var use_x_axis_path = false;
  var use_y_axis_path = false;

  //determine current location of bot
  var my_x = get_my_x();
  var my_y = get_my_y();

  //bot takes zig-zag path when needing to go digonal.  Prefers to
  //decrease the largest delta for x and y first.  
  var difference_x = my_x - position_x;
  var difference_y = my_y - position_y;

  //Check if bot is already at that location
  if (difference_x === 0 && difference_y === 0){
    error_message_field = "bot already at destination.";
    return -1;
  }

  //Determines in which directions the fruit location is relative to the player bot.
  //Must determine if north, south, east, west or combination of 2.
  var location_west_of_mybot = false;
  var location_east_of_mybot = false;
  var location_north_of_mybot = false;
  var location_south_of_mybot = false;

  if (difference_x > 0) location_west_of_mybot = true;
  else if (difference_x < 0) location_east_of_mybot = true;

  if (difference_y > 0) location_north_of_mybot = true;
  else if (difference_y < 0) location_south_of_mybot = true;



  //Determine to move along x axis or y axis first.
  //Prefer the axis with larger delta between positions.
  var magnitude_difference_x = Math.abs(difference_x);
  var magnitude_difference_y = Math.abs(difference_y);
  if ( magnitude_difference_x > magnitude_difference_y){
    use_x_axis_path = true;
  }
  else if (magnitude_difference_x < magnitude_difference_y){
    use_y_axis_path = true;
  }

  else{
    //pick at random x or y to move along when both are equal in magnitude.
    var rand = Math.random() * 2;
    if (rand < 1) use_x_axis_path = true;
    else if (rand < 2) use_y_axis_path = true;
  }

  //Select move direction using x and y axis preference.  Will always give an x and a y
  //move direction unless we are lined up with the target location or on the target location.
  //If lined up, only 1 available move choice, which will be reflected in both the relative position
  //as well as the x or y axis picker.
  if (use_x_axis_path){
    if (location_west_of_mybot) return WEST;
    else if (location_east_of_mybot) return EAST;
    else{
      error_message_field = "bot routing error. EAST or WEST could not be picked in route_bot_to_go_to_location method.";
      return -1;
    }
      
  }
  else if (use_y_axis_path){
    if (location_north_of_mybot) return NORTH;
    else if (location_south_of_mybot) return SOUTH;
    else{
      error_message_field = "Bot routing error. NORTH or SOUTH could not be picked in route_bot_to_go_to_location method.";
      return -1;
    }
  }
  else{
    error_message_field = "bot routing error. No x and y axis path picked in route_bot_to_go_to_location method.";
    return -1;
  }

}

//Checks if the bot has arrived at the go_to_this_node_location location
function has_arrive_at_move_to_location(){

}

//Checks if more than 1 adjacent fruit
function is_there_more_than_1_adjacent_fruit(my_position_x, my_position_y){
  var my_x = my_position_x;
  var my_y = my_position_y;
  var num_adjacent_fruit_to_position = 0;

  //Check North, East, South, West directions
  //Check North
  if (does_position_have_fruit(my_x,my_y-1))
    num_adjacent_fruit_to_position++;
  //Check East
  if (does_position_have_fruit(my_x+1,my_y))
    num_adjacent_fruit_to_position++;
  //Check South
  if (does_position_have_fruit(my_x,my_y+1))
    num_adjacent_fruit_to_position++;
  //Check West
  if (does_position_have_fruit(my_x-1,my_y))
    num_adjacent_fruit_to_position++;

  //Determine number of fruit adjacent is more than 1 adjacent fruit
  if (num_adjacent_fruit_to_position > 1)
    return true;
  else
    return false;
}

//Determine which directions have fruit from provided location.  Returns a
//DirectionsContainer object
function which_directions_have_fruit_from(my_position_x, my_position_y){
  var my_x = my_position_x;
  var my_y = my_position_y;

  if (my_position_x === null || my_position_y === null){
    error_message_field = "no position inputs provided in 'which_directions_have_fruit_from' method";
    return false;
  }

  var item_to_north = false;
  var item_to_east = false;
  var item_to_south = false;
  var item_to_west = false;



  //Check North, East, South, West directions
  //Check North
  if (does_position_have_fruit(my_x,my_y-1))
    item_to_north = true;
  //Check East
  if (does_position_have_fruit(my_x+1,my_y))
    item_to_east = true;
  //Check South
  if (does_position_have_fruit(my_x,my_y+1))
    item_to_south = true;
  //Check West
  if (does_position_have_fruit(my_x-1,my_y))
    item_to_west = true;

  //Package directions into DirectionsContainer Object
  var outputDirectionsContainer = new DirectionsContainer(item_to_north, item_to_east, item_to_south, item_to_west);

  return outputDirectionsContainer;
}


//-------DirectionsContainer Object---------------------------
//DirectionsContainer serves as a wrapper to export multiple direction arguments
//from a method.
function DirectionsContainer(has_item_to_north_input, has_item_to_east_input, has_item_to_south_input, has_item_to_west_input){

  this.has_item_to_north = has_item_to_north_input;
  this.has_item_to_east = has_item_to_east_input;
  this.has_item_to_south = has_item_to_south_input;
  this.has_item_to_west = has_item_to_west_input;
}
//------------------------------------------------------------

//Decides which direction to move in if more than 1 adjacent North, East, South, or West block has a fruit in it
function determine_direction_when_more_than_one_adjacent_fruit(my_position_x, my_position_y){

  if (!is_there_more_than_1_adjacent_fruit(my_position_x, my_position_y))
    return -1;

  //Get directions which have items in them, and extract to separate variables
  var itemDirections = which_directions_have_fruit_from(my_position_x, my_position_y);
  var has_item_to_north = itemDirections.has_item_to_north;
  var has_item_to_east = itemDirections.has_item_to_east;
  var has_item_to_south = itemDirections.has_item_to_south;
  var has_item_to_west = itemDirections.has_item_to_west;

  //Store counts of fruits in each scan direction.
  var fruits_to_north = 0;
  var fruits_to_east = 0;
  var fruits_to_south = 0;
  var fruits_to_west = 0;

  fruits_to_north = scanDirection(NORTH);
  fruits_to_east = scanDirection(EAST);
  fruits_to_south = scanDirection(SOUTH);
  fruits_to_west = scanDirection(WEST);

  //Array to store fruit and direction for sorting.
  var direction_sorting_array = [];

  if (is_there_more_than_1_adjacent_fruit(my_position_x, my_position_y)){
    //Scan directions if item is adjacent in that direction
    if (has_item_to_north){
      direction_sorting_array.push(new KeyValuePair(NORTH, fruits_to_north));
    }
    if (has_item_to_east){
      direction_sorting_array.push(new KeyValuePair(EAST, fruits_to_east));
    }
    if (has_item_to_south){
      direction_sorting_array.push(new KeyValuePair(SOUTH, fruits_to_south));
    }
    if (has_item_to_west){
      direction_sorting_array.push(new KeyValuePair(WEST, fruits_to_west));
    }
  }
  //Determine which direction has the most fruit (if direction is unavailable, value would've been 0 anyways)
  //Sort the 'direction_sorting_array' array in descending order to get highest fruit count at index 0.
  direction_sorting_array.sort(function(a,b){return b.value_amount - a.value_amount;});
  
  var direction_picked = direction_sorting_array[0].key;//Pick direction that ranks highest.

  //return direction to choose 765111
  return  direction_picked;
}

//Object to store key-value pair in an array for sorting
function KeyValuePair(key_input,value_input){
  this.key = key_input;
  this.value_amount = value_input;
}

//--------------------Prioritize Winnable Categories-----------------------
//In order to not waste turns, we want to be able to target down the fruit categories that have less fruit to win.
//Since the computer will home in on the nearest fruit, we want our bot to skip over less important fruit, which
//will allow for arrival at the target fruit earlier.

//Looks for lowest number of fruit count to win category.  Ignore any fruit in categories already lost.



//--------------------------------------------------------------------------

//--------------------------PrioritiesObject----------------------------------------
//Store 1 of this object as a global then update each turn.  Prioritize based on easiest category to get
//win status.
function PrioritiesObject(){
  this.number_of_item_types = get_number_of_item_types();
  this.win_status_for_item_types = new Array();
  this.total_item_count_for_item_types = new Array();//Only needs to be done once at start.
  this.player_item_count_for_item_types = new Array();
  this.opponent_item_count_for_item_types = new Array();
  this.remaining_item_count_for_item_types = new Array();
  //update each table for each item type.
  //Initially, player item counts
  //will be 0 since nothing was collected.
  var i;
  for (i = 0 ; i < this.number_of_item_types ; i++){
    this.win_status_for_item_types[i] = "undetermined";
  }

  for (i = 0 ; i < this.number_of_item_types ; i++){
    this.total_item_count_for_item_types[i] = get_total_item_count(i+1);
  }

  for (i = 0 ; i < this.number_of_item_types ; i++){
    this.player_item_count_for_item_types[i] = 0;
  }

  for (i = 0 ; i < this.number_of_item_types ; i++){
    this.opponent_item_count_for_item_types[i] = 0;
  }

  for (i = 0 ; i < this.number_of_item_types ; i++){
    this.remaining_item_count_for_item_types[i] = this.total_item_count_for_item_types[i];
  }
 
  //Update all counts class instance method.  No need to do totals, since it is always the same.
  this.update_item_counts = function(){
 
    var i;
    for (i = 0 ; i < this.number_of_item_types ; i++){
      this.player_item_count_for_item_types[i] = get_my_item_count(i+1);
    }

    for (i = 0 ; i < this.number_of_item_types ; i++){
      this.opponent_item_count_for_item_types[i] = get_opponent_item_count(i+1);
    }

    for (i = 0 ; i < this.number_of_item_types ; i++){
      this.remaining_item_count_for_item_types[i] = this.total_item_count_for_item_types[i] -
        this.player_item_count_for_item_types[i] - this.opponent_item_count_for_item_types[i];
    }

    //Determine if player has more than 50% of that fruit type.  Logs win if so.  If equal 50% for player and none remaining, tie, 
    //if opponent has 50% and fruit type is still remaining, counted as a fruit type that cannot be won.  Can tweak to pick this category
    //up if we are scretching the need to win or tie up a segment.
    //else if opponent has more than 50% of that fruit type, log a loss.  If none of those conditions, marks status
    //as default, which is 'undetermined'
    for (i = 0 ; i < this.number_of_item_types ; i++){
      this.determine_win_status_for_item_type(i+1);
    }

  };

  //Checks for item_type win_status category and updates priorities_list win statuses
  this.determine_win_status_for_item_type = function(item_type_id_value){
    if (!checkIfItemIdValid(item_type_id_value)){
      error_message_field = "argument for 'determine_win_status_for_item_type' invalid value.";
      return false;
    }
    //If valid input, convert for index of item types
    var i = item_type_id_value - 1;

    if (this.player_item_count_for_item_types[i]/this.total_item_count_for_item_types[i] > 0.50)
      this.win_status_for_item_types[i] = "win";
    else if (this.player_item_count_for_item_types[i]/this.total_item_count_for_item_types[i] === 0.50 &&
      this.remaining_item_count_for_item_types[i] === 0)
      this.win_status_for_item_types[i] = "tie";
    else if (this.opponent_item_count_for_item_types[i]/this.total_item_count_for_item_types[i] === 0.50)
      this.win_status_for_item_types[i] = "can't win";
    else if (this.opponent_item_count_for_item_types[i]/this.total_item_count_for_item_types[i] > 0.50)
      this.win_status_for_item_types[i] = "lose";
    else
      this.win_status_for_item_types[i] = "undetermined";
    return true;
  };

  //Checks on the item type to see if that item type is undetermined.  Returns true if undetermined
  //else returns false.
  this.check_if_undetermined_win_status_for_item_type = function(item_type_value){
    if (this.win_status_for_item_types[item_type_value - 1] == "undetermined")
      return true;
    else
      return false;
  };


  //Check and return type of win status.  Does not update priorities_list win statuses
  this.check_and_return_item_type_win_status = function(item_type_id_value){
    if (!checkIfItemIdValid(item_type_id_value)){
      error_message_field = "argument for 'determine_win_status_for_item_type' invalid value.";
      return "error with input";
    }
    //If valid input, convert for index of item types
    var i = item_type_id_value - 1;

    if (this.player_item_count_for_item_types[i]/this.total_item_count_for_item_types[i] > 0.50)
      return "win";
    else if (this.player_item_count_for_item_types[i]/this.total_item_count_for_item_types[i] === 0.50 &&
      this.remaining_item_count_for_item_types[i] === 0)
      return "tie";
    else if (this.opponent_item_count_for_item_types[i]/this.total_item_count_for_item_types[i] === 0.50)
      return "can't win";
    else if (this.opponent_item_count_for_item_types[i]/this.total_item_count_for_item_types[i] > 0.50)
      return "lose";
    else
      return "undetermined";

  };

  //Check for item_type win status category if opponent gained more for that fruit category by
  //the argument amount.  Specify player bot with 0, or opponent bot by 1.
  this.check_win_status_for_item_type_if_a_bot_gained_this_amount = function(fruit_type_id, fruit_quantity, receiving_bot){
    
    //Validate fruit type id
    var fruit_type_selected_valid = checkIfItemIdValid(fruit_type_id);
    if (!fruit_type_selected_valid){
      error_message_field = "input for fruit_type_id invalid in method 'check_win_status_for_item_type_if_a_bot_gained_this_amount'";
      return "invalid 'fruit_type_id' input";
    }
    //Create variables to contain add amounts.
    var my_fruit_count_add_amount = 0;
    var opponent_fruit_count_add_amount = 0;
    
    //apply changes to selected bot
    //Applies to player bot
    if (receiving_bot === 0){
      my_fruit_count_add_amount = fruit_quantity;
    }
    //Applies to opponent bot
    else if (receiving_bot === 1){
      opponent_fruit_count_add_amount = fruit_quantity;
    }
    //Attempting apply to invalid bot.
    else{
      error_message_field = "'check_win_status_for_item_type_if_a_bot_gained_this_amount' applied to invalid bot value";
    }

    //calculate if there is a win status and determine which outcome.
    //If valid input, convert for index of item types
    //Augments from fruits added are calculated in.
    var i = fruit_type_id - 1;

    if ((this.player_item_count_for_item_types[i] + my_fruit_count_add_amount)/
      (this.total_item_count_for_item_types[i] + opponent_fruit_count_add_amount) > 0.50)
      return "win";
    else if ((this.player_item_count_for_item_types[i] + my_fruit_count_add_amount)/
      (this.total_item_count_for_item_types[i] + opponent_fruit_count_add_amount) === 0.50 &&
      this.remaining_item_count_for_item_types[i] === 0)
      return "tie";
    else if ((this.opponent_item_count_for_item_types[i] + my_fruit_count_add_amount)/
      (this.total_item_count_for_item_types[i] + opponent_fruit_count_add_amount) === 0.50)
      return "can't win";
    else if ((this.opponent_item_count_for_item_types[i] + my_fruit_count_add_amount)/
      (this.total_item_count_for_item_types[i] + opponent_fruit_count_add_amount) > 0.50)
      return "lose";
    else
      return "undetermined";
  };
  
}
//-------------------------------------------------------------------------------------------------------------

function scan_and_return_fruit_types(bound_x_min, bound_x_max, bound_y_min, bound_y_max){
  var board = get_board();
  nearest_fruit_listing.length = 0; //**DEBUG***CLEAR FRUIT LISTING
  for (var x = bound_x_min ; x <= bound_x_max ; x++)
    for (var y = bound_y_min ; y <= bound_y_max ; y++){
      if (isValidMove(x , y)){
        var fruit_type = board[x][y];
        if (fruit_type !== null && fruit_type > 0){
          return fruit_type;
        }
      }
    }
  return 0;
}
//----------------------------------------------------------------------------------------------------------------
//Find priority fruit type. Returns the fruit id value of the current fruit type to prioritize.
function findPriorityFruitType(){
  //Checks map for location of fruit that require higher priority to collect, and those
  //that do not matter.
  //Create the priorities_listing object if doesn't exist, otherwise update.
  if (priorities_listing === null){
    priorities_listing = new PrioritiesObject();
  }
  else
    (priorities_listing.update_item_counts());

  //determine fruit type that currently requires the least fruit to win.  Check starting amounts
  //check type of fruit if its status is 'undecided'.  All other cases, choose to ignore that fruit.
  //
  var current_fruit_with_least_needed_to_win_by_total = null;
  var current_fruit_item_id_number = null;
  var current_fruit_item_quantity = 0;
  var list_of_winnable_fruit_item_group_type = new Array();
  
  //Formulate list of all fruit types that are undecided win status and total fruits that are available for them.
  var number_of_fruit_types = priorities_listing.number_of_item_types;
  for (var type_id = 1; type_id <= number_of_fruit_types ; type_id++){
    var fruit_type_has_undetermined_win_status = priorities_listing.check_if_undetermined_win_status_for_item_type(type_id);
    if (fruit_type_has_undetermined_win_status){
      current_fruit_item_id_number = type_id;
      current_fruit_item_quantity = get_total_item_count(type_id);
      list_of_winnable_fruit_item_group_type.push(new KeyValuePair(current_fruit_item_id_number, current_fruit_item_quantity));
    }
  }

  //sort the list of winnable fruit item group types
  list_of_winnable_fruit_item_group_type.sort(function(a,b){return a.value_amount-b.value_amount;});

  //determine the fruit with least on the field for quick category win by selecting the index 0 type.
  current_fruit_with_least_needed_to_win_by_total = list_of_winnable_fruit_item_group_type[0].key;


  return current_fruit_with_least_needed_to_win_by_total;
}

//Find nearest fruit matching the priority fruit type.  Check the list of 'nearest_fruit_listing'
//and proceed along the array until we find a listed location containing the fruit priority type.
//Returns a node object for the nearest location match.  Set 'priority_fruit_proximity_list_index_value' 
//argument to 1 for 1st in list of closest for the type,
//2 for the second, etc.  Can also leave blank for default value.  Within the game framework, this value
//really should be 1 unless the opponent is about to capture a fruit, in which case this value might be 2.  
//If nearest priority fruit location does not exist, then this method returns null as no matches were found.
//checks against nearest_fruit_listing and iterates through it until it finds a fruit that matches the priority fruit id.
//Since list is already sorted by distance, this would be the nearest fruit of the desired type.
//If we have an argument, checks for that value of closeness.  1 is closest, and increases with each next location farther.
//If we set the argument to 2, and both items continue to persist on the board, the bot will bounce back and forth due to
//the distance changing at every turn.  Either the movement algorithm has to store that fruit location and update it
//when a state change occurs to it, or only use it in the case of knowing the opponent will take the nearest fruit to the
//player bot.
function findNearestPriorityFruitLocation(priority_fruit_proximity_list_index_value_input){

  var priority_fruit_type_match_cycle = 1;//Contains the check cycle for the priority fruit type.  Starts at 1.  Increments each time fruit type found.
  if(typeof(priority_fruit_proximity_list_index_value_input) === 'undefined') priority_fruit_proximity_list_index_value_input = 1;
  var priority_fruit_proximity_list_index_value = priority_fruit_proximity_list_index_value_input;
  var board = get_board();
  var nearest_fruit_listing_size = nearest_fruit_listing.length;
  var fruit_priority_id_value = findPriorityFruitType();
  var search_x = null;
  var search_y = null;

  for (var i = 0 ; i < nearest_fruit_listing_size ; i++){
    search_x = nearest_fruit_listing[i].x;
    search_y = nearest_fruit_listing[i].y;

    //If match found, returns the reference to the matching node containing the nearest priority fruit.
    if (board[search_x][search_y] === fruit_priority_id_value){
      var nearest_priority_fruit_location_node = nearest_fruit_listing[i];

      //Check if this priority fruit type is the desired proximity.  If the argument requires the next closest (
      //priority_fruit_proximity_list_index_value_input = 2,
      //we would skip the return on the furst pass, cycle and look for the next one.
      if (priority_fruit_type_match_cycle === priority_fruit_proximity_list_index_value){
        return nearest_priority_fruit_location_node;
      }
      else{
        priority_fruit_type_match_cycle++;
      }
    }
  }

  return null;
}

//Check if player is already on a location specified.
function checkIfPlayerOnLocation(input_x, input_y){
  var my_x = get_my_x();
  var my_y = get_my_y();

  if (my_x === input_x && my_y === input_y)
    return true;
  else
    return false;
}

//Check if opponent already on a location specified.
function checkIfOpponentOnLocation(input_x, input_y){
  var opponent_x = get_opponent_x();
  var opponent_y = get_opponent_y();
  
  if (opponent_x === input_x && opponent_y == input_y)
    return true;
  else
    return false;

}

//Checks if item id is valid
function checkIfItemIdValid(item_id_input){
  var number_of_item_types = get_number_of_item_types();
  if (item_id_input > 0 && item_id_input <= number_of_item_types){
    return true;
  }
  else{
    error_message_field = "invalid item id input";
    return false;
  }
}



// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}

