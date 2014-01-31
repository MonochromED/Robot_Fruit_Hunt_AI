//Test seed: 785282
//Ring test seed: 558738
//Currently working on the ring_scan() method.


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

  

  check_all_ring_position(1, my_x, my_y);
  test_text_field = nearest_fruit_listing.length;

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
//---------------------------OLD FUNCTION--------------------------------------
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


  //Scan NESW blocks for fruit
  move_to = checkNESW(my_x,my_y);

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
  var move_distance = 0;
  var my_x = central_coordinate_x;
  var my_y = central_coordinate_y;
  var ring_distance = distance_from_center_to_north_position;
  var board = get_board();//Board data.


  //Determine max North, East, South, West positions possible using the straight distance limit if we generated
  //a radius from the center to the cardinal directions and diagonals with the specified distance.  These boundaries
  //would be my_position - distance, and my_position + distance for the x and y coordinates.  Both x and y values can
  //be set to the min or max simultaneously.  
  // x x x
  // x p x
  // x x x
  //Scan ring looks like above around the player at 1 distance.  8 blocks to scan.  At 2 distance, would be the full 
  //ring, and be a 5x5 grid minus the center.  Excluding the 1 distance ring, the second ring will be 16 blocks to scan.

  //Check all ring positions for fruit.  specify scan radius for the ring.


  //*************%%%%%%%%%%%%%%%%%%%%%%******************CONTINUE CODING AT THIS STEP*****************************
  //Call up the 'find_next_ring_position' method to get our next position.
  //update the 'check_position_x' and 'check_position_y' variables
  //run the check to see if any item is on that current board location.  That method/or code block will
  //push an valid nodes onto the nearest_fruit_listing array.

  //Check that if position current === start northern position, we break the ring scan loop.


  return true;
}

//Check block for fruit and push to fruit listing if fruit is found on that block
//which includes the position and distance of player bot to that fruit.
//Returns 0 if no fruit found or invalid block, returns 1 if fruit found on block.
function check_position_for_fruit(check_position_x, check_position_y){
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
  //At each location that we check for fruit, we invoke the 'check_position_for_fruit' method.
  //When the position returns to the 12 o clock position, we terminate the loop.
  nearest_fruit_listing.length = 0; //**DEBUG***CLEAR FRUIT LISTING
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
    check_position_for_fruit(check_position_x, check_position_y);
  }


  //then
 /*-------------BROKEN----
  //start while loop which runs while looped_ring_once != true;
  while (looped_ring_once === true){
    var next_position_node = find_next_ring_position(ring_distance, my_x, my_y, check_position_x, check_position_y);
    var counter = 0;
    //update to the next position
    check_position_x = next_position_node.x;
    check_position_y = next_position_node.y;

    //Check if block is starting position
    if (check_position_x == beginning_position_x && check_position_x == beginning_position_y){
      looped_ring_once = true;
    }
    else if (counter == 9){
      looped_ring_once = true;
    }
    else{
      //Check if block valid, then check for fruit.  Done by the fruit checking method
      check_position_for_fruit(check_position_x, check_position_y);
      counter = counter + 1;
    }
  }
  */
  var counter = 0;
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
      check_position_for_fruit(check_position_x, check_position_y);

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
      for (j = 0; j < WIDTH ; j++)
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










// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}

