/* Rust Interactive Input Test */

use std::io;

fn main() {
    // Test 1: String input
    println!("What is your name? ");
    let mut name = String::new();
    io::stdin()
        .read_line(&mut name)
        .expect("Failed to read line");
    println!("Hello, {}!", name.trim());

    // Test 2: Integer input
    println!("How old are you? ");
    let mut age = String::new();
    io::stdin()
        .read_line(&mut age)
        .expect("Failed to read line");
    let age: i32 = age.trim().parse().expect("Please enter a number");
    println!("You are {} years old.", age);

    // Test 3: Multiple inputs
    println!("Enter a number: ");
    let mut num1 = String::new();
    io::stdin()
        .read_line(&mut num1)
        .expect("Failed to read line");
    let num1: i32 = num1.trim().parse().expect("Please enter a number");

    println!("Enter another number: ");
    let mut num2 = String::new();
    io::stdin()
        .read_line(&mut num2)
        .expect("Failed to read line");
    let num2: i32 = num2.trim().parse().expect("Please enter a number");

    println!("The sum is: {}", num1 + num2);
}
