pragma ton-solidity >= 0.51.0;
pragma AbiHeader expire;


contract Random {  

    struct rand {
        uint8 f;    
        uint8 s;    
        uint8 t;    
    }
    mapping (address=>rand) DB;    

    function getNums(address a) public returns(rand){
        return DB[a];
    }

    function getrandom(address a) public {
       require(msg.value >= 1e9, 100, "message without amount is blocked");       
       tvm.accept();//0.007377001 - плата за одну рандомную генерацию
       rnd.shuffle(tx.timestamp + now);       
       uint8 first = rnd.next(9)+1;
       uint8 second = rnd.next(9)+1;
       uint8 third = rnd.next(9)+1;

       uint128 value = calculateAmount(first, second, third);
       
       if(value > 0){       
           prize(msg.sender, value);           
       }

       rand r = rand(first, second, third);
       DB[a] = r;
    }

    function prize(address dest, uint128 value) private pure {
        tvm.accept();  
        dest.transfer(value, true, 3);        
    }

    function calculateAmount(uint first, uint second, uint third) public returns(uint128){
        if( first == second && second == third){
            return 1e11;
        }
      
        if( first == second || second == third || first == third){
            return 1e10-1e9;
        }

        return 0;
    }
}
