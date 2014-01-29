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


//----Node Object-----
function node(x, y, move) {
    this.x = x;
    this.y = y;
    this.move = move;
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
        if (board[i][j]){
          fruit_count++;
        }
      }
    }
  }

  if (direction_of_scan == EAST){
    for (i = (mybot_position_val_x+1); i < WIDTH ; i++){
      for (j = 0; j < HEIGHT ; j++)
      {
        if (board[i][j]){
          fruit_count++;
        }
      }
    }
  }

  if (direction_of_scan == SOUTH){
    for (j = (mybot_position_val_y+1); j < HEIGHT ; j++){
      for (i = 0; i < WIDTH ; i++)
      {
        if (board[i][j]){
          fruit_count++;
        }
      }
    }
  }

  if (direction_of_scan == WEST){
    for (i = (mybot_position_val_x-1); i >= 0 ; i--){
      for (j = 0; j < WIDTH ; j++)
      {
        if (board[i][j]){
          fruit_count++;
        }
      }
    }
  }
  return fruit_count;


  
}
//










// Optionally include this function if you'd like to always reset to a 
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}

