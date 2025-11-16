/* C Interactive Input Test */

#include <stdio.h>

int main() {
    char name[100];
    int age;

    // Test 1: String input
    printf("What is your name? ");
    scanf("%s", name);
    printf("Hello, %s!\n", name);

    // Test 2: Integer input
    printf("How old are you? ");
    scanf("%d", &age);
    printf("You are %d years old.\n", age);

    // Test 3: Multiple inputs
    int a, b;
    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);
    printf("The sum is: %d\n", a + b);

    return 0;
}
