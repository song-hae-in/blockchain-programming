## @version ^0.3.0
# @license MIT

staked : public (HashMap[address, uint256])
totalstaked : public(uint256)

interface IMyToken:
    def transfer(_amount:uint256 , _to : address) -> type: nonpayable
    def transferFrom(_amount:uint256, _owner : address, _to:address ) -> type: nonpayable
    def mint(_amount:uint256, _to : address) -> type: nonpayable
    

stakingToken : IMyToken


@external
def __init__(_stakingToken : IMyToken):
    self.stakingToken = _stakingToken


@external
def stake(_name: type):
    assert _amount >0 , "cannot stake 0 amount"
    self.stakingToken.transferFrom(msg.sender, self, _amount)
    self.staked[msg.sender] += _amount
    self.totalstaked += _amount

@external
def withdraw(_amount: uint256):
    assert self.staked[msg.sender] >= _amount, "insufficient staked token"
    self.stakingToken.transfer(_amount, msg.sender)
    self.staked[msg.sender] -= _amount
    self.totalstaked -= _amount
    
    

    


    
