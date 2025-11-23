# @version ^0.3.0
# @license MIT

"""
@author <tintinweb ;)>
@notice <Determine if Bugs will accept `food` to eat>
@dev <Compares the entire string and does not rely on a hash>
@param <food The name of a food to evaluate (in English)>
@return <true if Bugs will eat it, false otherwise>
"""

name : public(String[64])
symbol : public(String[32])
decimals : public(uint256)
totalSupply : public(uint256)

balnceOf : public(HashMap[address, uint256])
allowances : public(HashMap[address, HashMap[address, uint256]])
@external
def __init__(_name: String[64], _symbol : symbol[32], _decimal:uint256 , _totalSupply : uint256):
    self.name = _name
    self.symbol = _symbol
    self.decimals = _decimal
    self.totalSupply = _totalSupply

@external
def approve(_spender: address, _amount : uint256):
    self.allowances[msg.sender][_spender] += _amount


@external
def transferFrom(_owner: address, _to : address, _amount : uint256):
    assert self.allowances[_owner][msg.sender] >= _amount, "insufficient allowance"
    assert self.balnceOf[_owner] >= _amount, "insufficient balance"
    self.balnceOf[_owner] -= _amount
    self.balnceOf[_to] += _amount
    self.allowances[_owner][msg.sender] -= _amount

@internal
def _mint(_amount: uint256, _to :address):
    self.balanceOf[_to] += _amount
    self.totalSupply += _amount

@external
def mint(_amount: uint256, _to : address):
    self._mint(_amount, _to)
    

    

    

    
  
