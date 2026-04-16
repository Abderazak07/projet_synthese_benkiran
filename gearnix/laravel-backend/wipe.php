<?php
$pdo = new PDO('mysql:host=127.0.0.1;dbname=gestion_commandes_db', 'root', '');
$pdo->exec('SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Commande_Produit, Livraison, Paiement, Commande, Produit, User, users, cache, cache_locks, jobs, job_batches, failed_jobs, migrations, personal_access_tokens, password_reset_tokens, sessions;
SET FOREIGN_KEY_CHECKS = 1;');
echo 'Wiped.';
