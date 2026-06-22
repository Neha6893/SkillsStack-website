//Event handling using "this" reference
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
class ActionListenerExample3 extends JFrame implements ActionListener{
	JButton b1 = new JButton("Cancle");
	ActionListenerExample3(){
		setBounds(100,100,800,600);
		setTitle("MY APP");
		setLayout(new FlowLayout());
		add(b1);
		b1.addActionListener(this);
	}
	public void actionPerformed(ActionEvent e){
		System.out.println("Good Night");
	}
	public static void main(String[] args){
			ActionListenerExample3 ale = new ActionListenerExample3();
			ale.setVisible(true);
			ale.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}
}