<?php
$email = 'admin3@devslogs.com';  // Replace this with the actual email you want to use
$password = '@dmin5';  // Replace this with the actual password you want to use
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
echo $hashed_password;