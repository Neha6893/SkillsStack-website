import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("person.ser"))) {
            Person p = (Person) in.readObject();
            System.out.println("Name: " + p.name);
            System.out.println("Age: " + p.age);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}