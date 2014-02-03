//Test seed: 785282
//Ring test seed: 558738
//Currently working on method to pick between 2 equidistant positions based on nearby fruit to those positions.
//Want to get the maximum number of fruit types.  Can win in the different categories.
//As such, we want to calculate the number of each fruit the player bot and the computer bot has.
//If a category has only 1 of that fruit on the field, it means an easy win, and we should prioritize that fruit.
//Fruits with high quantity make it hard to win in that category, so we might want to consider tossing it out, since
//it would require more turns in order to obtain.


//---Global Variables-----------
var mybot_position_val_x = 1;//Test variable **DEBUG**
var mybot_position_val_y = 1;//Test variable **DEBUG**
var test_spot_has_item = 0;//Test variable **DEBUG**
var fruit_density_array = new Array();//Area fruit density listing.  Contains AreaFruitDensity objects.
var nodes_checked = new Array();//Contains an array of nodes that have been checked.
var nodes_to_check = new Array();//Contains an array of nodes that have to be checked still.
var default_move_direction = NORTH;
var move_to = -1;
var is_valid_move = true;
var test_fruit_count = 0;
var test_fruit_count_direction = NORTH;
var nearest_fruit_listing = new Array();//Contains an array of all the nearest fruit by number of moves.
var go_to_this_node_location = null;
var test_text_field = "none";//Text field used for testing output.
var error_message_field = "none";//Displays error message when error caught in algorithms.

//-----------------------------------------------

//----------AreaFruitDensity object-----------------
//AreaFruitDensity objects contain the origin x and y, as well as the block distance in
//number of moves from that origin.  Thus, if the block is North, East, South, or West by 1
//block from the origin location, it receives a radius distance of 1.  If it is diagonal
//then 2 moves are required, and this would be only included if the radius distance was set to 2.


//---------------------------------------------------

//--------Determine chain path------------------
//We then want to determine a particular square's neighbor also has high density.  Thus
//we want to home in on the higher fruit density areas when this is triggered.


//----NodeDistObj Object-----
function nodeDistObj(x, y, distance_to_player) {
    this.x = x;
    this.y = y;
    this.player_distance_to_this_node = distance_to_player;//This is measured in moves horizontal and vertical.
}
//-------------------
function new_game() {
   test_spot_has_item = true;//On game resets to true so mybot moves
}


//***AI Goals****
//Determine highest density area of fruit
//Move to that area based on shortest pathway.
//If shortest path to the edge of that area contains fruit
//collect those fruit along the way.

function make_move() {
  var board = get_board();

  //Get information
  var my_x = get_my_x();
  var my_y = get_my_y();
  mybot_position_val_x = get_my_x();// **DEBUG** Test variable
  mybot_position_val_y = get_my_y();// **DEBUG** Test variable

  //-----------TEST SCAN **DEBUG**----Shows value in the direction before mybot moves, but map will show post move---
  var scan_direction = EAST;//**DEBUG** Test variable
  test_fruit_count = scanDirection(scan_direction);//**DEBUG** Test variable
  test_fruit_count_direction = scan_direction;//**DEBUG** Test variable





  //check_all_ring_position(1, my_x, my_y);
  //test_text_field = nearest_fruit_listing.length;
  //sort_nearest_fruit_listing();

  /*
  ring_scan(3, my_x, my_y);//**Test ring scan for detection
  //Retrieve from list of nearest fruit if list is populated.  This list should be sorted, so element on top is nearest
  if (nearest_fruit_listing.length !== 0){
  nearest_fruit_listing_element = nearest_fruit_listing.pop();//check 1st entry is contains node
  test_text_field = nearest_fruit_listing_element.player_distance_to_this_node;
  }
  */

   //---------------END TEST AREA---------------------------------------------------------------------


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

   //return SimpleBot.findMove(new node(get_opponent_x(), get_opponent_y(), -1));
   
   // Movement algorithm
   //We first analyze the current board condition, which was passed into the 'board' variable
   //at the beginning of this method.  
   //var rand = Math.random() * 4;

   //if (rand < 1) return NORTH;
   //if (rand < 2) return SOUTH;
   //if (rand < 3) return EAST;
   //if (rand < 4) return WEST;  
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


  //Check adjacent blocks to player to see if there is more than 1 
  //fruit adjacent within 1 move distance.
  if (is_there_more_than_1_adjacent_fruit(my_x,my_y)){
    move_to = determine_direction_when_more_than_one_adjacent_fruit(my_x, my_y);
    return move_to;
  }

  
  //Scan for nearest fruit on map
  scan_block_area(0,WIDTH-1,0,HEIGHT-1);//Scans entire map
  //Sorts list for nearest fruit
  sort_nearest_fruit_listing();
  //Gets the x and y coordinate of this fruit
  var go_to_x = nearest_fruit_listing[0].x;
  var go_to_y = nearest_fruit_listing[0].y;

  //moves bot in direction towards specified location
  move_to = route_bot_to_go_to_location(go_to_x,go_to_y);

/*
  //Scan NESW blocks for fruit
  move_to = checkNESW(my_x,my_y);
*/


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
  nearest_fruit_listing.sort(function(a,b){return a.player_distance_to_this_node-b.player_distance_to_this_node});

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

//**************WORKING ON THIS PART*************************
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
  
  var direction_picked = direction_sorting_array[0].key;
  test_text_field = fruits_to_west;
  //return direction to choose 765111
  return  direction_picked;
}

//Object to store key-value pair in an array for sorting
function KeyValuePair(key_input,value_input){
  this.key = key_input;
  this.value_amount = value_input;
}


//Simple mod to nearest fruit algorithm
//Detect type of fruit.  If increases variety of fruit in bag, pick that one if all cases even.
//Also check if fruit next to next fruit has a fruit that is not one that was previous to it in the path.

//Determine path to each fruit on map and then a pathway following each one to get 51% control by
//measuring number of turns to get to a certain block by following the algorithm to take the nearest
//fruit instead of choosing an alternate.  Find way to mark and ignore fruit that the computer will go after.
//74350


// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}

