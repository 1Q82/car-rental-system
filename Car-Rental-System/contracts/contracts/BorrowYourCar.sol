// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./QiushiToken.sol";
import "hardhat/console.sol";

contract BorrowYourCar is ERC721 {

    event CarBorrowed(uint256 carId, address borrower, uint256 startTime, uint256 duration);

    struct Car {
        address owner;
        address borrower;
        uint256 borrowUntil;
        bool isAvailable;
    }

    mapping(uint256 => Car) public cars;
    mapping(address => uint256[]) public ownedCars;
    uint256[] public availableCars;
    uint256[] public borrowedCars;
    QiushiToken public qiushiToken;

    constructor(address tokenAddress) ERC721("BorrowYourCar", "BYC") {
        qiushiToken = QiushiToken(tokenAddress);
    }

    function addCar() external {
        uint256 carId = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
        _safeMint(msg.sender, carId);
        cars[carId] = Car(msg.sender, address(0), 0, true);
        ownedCars[msg.sender].push(carId);
        availableCars.push(carId);
    }

    function getOwnedCars() external view returns (uint256[] memory) {
        return ownedCars[msg.sender];
    }

    function getAvailableCars() external view returns (uint256[] memory) {
        return availableCars;
    }

    function updateInfo() external {
        for (uint i = 0; i < borrowedCars.length; i++) {
            if (uint256(cars[borrowedCars[i]].borrowUntil) < block.timestamp) {
                cars[borrowedCars[i]].isAvailable = true;
                availableCars.push(borrowedCars[i]);
                removeValue(borrowedCars, borrowedCars[i]);
            }
        }
    }

    function getOwner(uint256 carId) public view returns (address) {
        Car storage car = cars[carId];
        return car.owner;
    }

    function getBorrower(uint256 carId) public view returns (address) {
        if (uint256(cars[carId].borrowUntil) >= block.timestamp) {
            return cars[carId].borrower;
        } else {
            return address(0);
        }
    }

    function borrowCar(uint256 carId, uint256 duration) external {
        require(getOwner(carId) != msg.sender, "You are the owner of this car");
        Car storage car = cars[carId];
        require(car.isAvailable, "Car is not available for borrowing");

        // 不再计算租车费用和检查用户余额

        car.isAvailable = false;
        car.borrower = msg.sender;
        car.borrowUntil = block.timestamp + duration;

        removeValue(availableCars, carId);
        borrowedCars.push(carId);

        emit CarBorrowed(carId, msg.sender, block.timestamp, duration);
    }

    function removeValue(uint256[] storage array, uint256 value) internal {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }
}
