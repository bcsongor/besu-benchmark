pragma solidity >=0.5.11;
pragma experimental ABIEncoderV2;

contract KeyValueStore {
    event Stored(string indexed key);

    mapping(string => string) store;

    /// Puts $(values) in the key-value store using $(keys).
    function put(string[] memory keys, string[] memory values) public {
        for (uint256 i = 0; i < keys.length; i++) {
            store[keys[i]] = values[i];
            emit Stored(keys[i]);
        }
    }

    /// Retrieves values from the key-value store using $(keys).
    function get(string[] memory keys) public view returns (string[] memory) {
        string[] memory values = new string[](keys.length);
 
        for (uint256 i = 0; i < keys.length; i++) {
            values[i] = store[keys[i]];
        }

        return values;
    }
}
