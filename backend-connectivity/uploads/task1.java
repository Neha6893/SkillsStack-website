import java.util.Random;
import java.util.Scanner;

public class NumberGuessingGame {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Random random = new Random();

        int totalScore = 0;
        boolean playAgain = true;

        System.out.println("Welcome to the Number Guessing Game!");

        while (playAgain) {
            int numberToGuess = random.nextInt(100) + 1;
            int attemptsLeft = 7;
            boolean guessedCorrectly = false;

            System.out.println("\nI have chosen a number between 1 and 100.");
            System.out.println("You have " + attemptsLeft + " attempts to guess it!");

            while (attemptsLeft > 0) {
                System.out.print("Enter your guess: ");
                int userGuess = sc.nextInt();
                attemptsLeft--;

                if (userGuess == numberToGuess) {
                    System.out.println("Correct! You guessed the number.");
                    guessedCorrectly = true;
                    totalScore += 10;
                    break;
                } else if (userGuess > numberToGuess) {
                    System.out.println("Too high! Attempts left: " + attemptsLeft);
                } else {
                    System.out.println("Too low! Attempts left: " + attemptsLeft);
                }
            }

            if (!guessedCorrectly) {
                System.out.println("❌ Out of attempts! The number was: " + numberToGuess);
            }

            System.out.println("Your current score: " + totalScore);

            System.out.print("\nDo you want to play another round? (yes/no): ");
            String choice = sc.next().toLowerCase();
            playAgain = choice.equals("yes");
        }

        System.out.println("\nGame Over! Your final score: " + totalScore);
        sc.close();
    }
}
