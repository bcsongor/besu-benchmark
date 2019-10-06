pragma solidity >=0.4.22;
pragma experimental ABIEncoderV2;

contract KeyValueStore {
    event Stored(string indexed key);
    event Removed(string indexed key);

    mapping(string => string) store;

    /// Puts $(value) in the key-value store using $(key).
    function put(string[] memory key, string[] memory value) public {
        for (uint256 i = 0; i < key.length; i++) {
            store[key[i]] = value[i];
            emit Stored(key[i]);
        }
    }

    /// Retrieves a value from the key-value store using $(key).
    function get(string memory key) public view returns (string memory) {
        return store[key];
    }

    /// Deletes a value from the key-value store using $(key).
    function del(string memory key) public {
        store[key] = "";
        emit Removed(key);
    }
}
