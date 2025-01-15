<?php
$password = '@dmin5';  // Replace this with the actual password you want to use
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
echo $hashed_password;