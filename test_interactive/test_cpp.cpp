/* C++ Interactive Input Test */

#include <iostream>
#include <string>

using namespace std;

int main() {
    string name;
    int age;

    // Test 1: String input
    cout << "What is your name? ";
    cin >> name;
    cout << "Hello, " << name << "!" << endl;

    // Test 2: Integer input
    cout << "How old are you? ";
    cin >> age;
    cout << "You are " << age << " years old." << endl;

    // Test 3: Multiple inputs
    int a, b;
    cout << "Enter two numbers: ";
    cin >> a >> b;
    cout << "The sum is: " << (a + b) << endl;

    return 0;
}
