import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AldsLogin extends StatelessWidget {
  const AldsLogin({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ALDS',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        textTheme: GoogleFonts.antaTextTheme(),
      ),
      home: const AldsLoginWidget(),
    );
  }
}

class AldsLoginWidget extends StatefulWidget {
  const AldsLoginWidget({super.key});

  @override
  State<AldsLoginWidget> createState() => _AldsLoginWidgetState();
}

class _AldsLoginWidgetState extends State<AldsLoginWidget> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  void _loginAction() {
    final email = _emailController.text;
    final password = _passwordController.text;
    // Add your login logic here
    debugPrint('Email: $email, Password: $password');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   title: const Text('ALDS', style: TextStyle(fontSize: 24)),
      // ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'ALDS',
              style: TextStyle(fontSize: 48, fontWeight: FontWeight.w400),
              textAlign: TextAlign.center,
            ),
            // const Text(
            //   'Automatic Location Detection Service',
            //   style: TextStyle(fontSize: 18, fontWeight: FontWeight.w400),
            //   textAlign: TextAlign.center,
            // ),
            const SizedBox(height: 30),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email/Username',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(),
              ),
              obscureText: true,
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _loginAction,
                child: const Text('Login'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
