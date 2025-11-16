# Python Interactive Input Test

# Test 1: Simple input
name = input("What is your name? ")
print(f"Hello, {name}!")

# Test 2: Multiple inputs
age = input("How old are you? ")
print(f"You are {age} years old.")

# Test 3: Input in a loop
total = 0
for i in range(3):
    num = input(f"Enter number {i+1}: ")
    total += int(num)

print(f"The sum is: {total}")
