<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $success, string $message): never {
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function loadSiteConfig(string $path): array {
    $source = @file_get_contents($path);
    if ($source === false || !preg_match('/window\.SITE_CONFIG\s*=\s*(\{.*\})\s*;/s', $source, $matches)) {
        throw new RuntimeException('Configuration unavailable.');
    }
    return json_decode($matches[1], true, 512, JSON_THROW_ON_ERROR);
}

function field(string $name, int $max = 500): string {
    $value = isset($_POST[$name]) && is_string($_POST[$name]) ? trim($_POST[$name]) : '';
    $value = str_replace(["\r", "\0"], '', $value);
    return mb_substr($value, 0, $max, 'UTF-8');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'This endpoint accepts POST requests only.');
}
if (field('website', 120) !== '') {
    respond(200, true, 'Thank you! We have successfully received your request. Our team will review your information and get back to you shortly.');
}

try {
    $config = loadSiteConfig(__DIR__ . '/config/config.js');
    $recipient = (string)($config['contact']['email'] ?? '');
    if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('Recipient configuration is invalid.');
    }
    $type = field('form_type', 24);
    if (!in_array($type, ['contact', 'advertise', 'quote'], true)) {
        respond(422, false, 'Invalid form type.');
    }
    $first = field('first_name', 80);
    $last = field('last_name', 80);
    $email = field('email', 160);
    if ($first === '' || $last === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) {
        respond(422, false, 'Please provide a valid name and email address.');
    }
    $phone = field('phone', 50);
    $company = field('company', 120);
    $subjectChoice = field('subject', 100);
    $comments = field('comments', 3000);
    $pageUrl = field('page_url', 500);
    $cartJson = field('cart_json', 12000);
    $cartLines = [];
    if ($type === 'quote') {
        $cart = json_decode($cartJson ?: '[]', true);
        if (!is_array($cart) || count($cart) === 0) {
            respond(422, false, 'Your cart is empty.');
        }
        foreach (array_slice($cart, 0, 30) as $item) {
            if (!is_array($item)) continue;
            $cartLines[] = sprintf(
                'SKU: %s | Product: %s | Variant: %s | Quantity: %d | Unit price: %.2f | Subtotal: %.2f',
                mb_substr((string)($item['sku'] ?? ''), 0, 80),
                mb_substr((string)($item['name'] ?? ''), 0, 160),
                mb_substr((string)($item['variant'] ?? ''), 0, 100),
                max(1, (int)($item['quantity'] ?? 1)),
                (float)($item['price'] ?? 0),
                (float)($item['price'] ?? 0) * max(1, (int)($item['quantity'] ?? 1))
            );
        }
    }
    $subject = sprintf('[%s] Website request from %s %s', strtoupper($type), $first, $last);
    $body = implode("\n", [
        'Form type: ' . $type,
        'First Name: ' . $first,
        'Last Name: ' . $last,
        'Email: ' . $email,
        'Phone: ' . ($phone ?: 'Not provided'),
        'Company: ' . ($company ?: 'Not provided'),
        'Subject: ' . ($subjectChoice ?: 'Not provided'),
        'Comments: ' . ($comments ?: 'Not provided'),
        '',
        'Cart:',
        $cartLines ? implode("\n", $cartLines) : 'Not applicable',
        'Subtotal estimate: ' . field('subtotal', 40),
        'Shipping country: ' . field('shipping_country', 120),
        'Shipping state/region: ' . field('shipping_region', 120),
        'Shipping postal code: ' . field('shipping_postal', 40),
        'Shipping estimate: ' . field('shipping_estimate', 40),
        'Total estimate: ' . field('total_estimate', 40),
        'Page URL: ' . ($pageUrl ?: ($_SERVER['HTTP_REFERER'] ?? 'Unknown')),
        'Timestamp: ' . gmdate('c')
    ]);
    $safeName = str_replace(["\r", "\n"], '', $first . ' ' . $last);
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: Website Inquiry <' . $recipient . '>',
        'Reply-To: ' . $safeName . ' <' . $email . '>'
    ];
    if (!@mail($recipient, $subject, $body, implode("\r\n", $headers))) {
        respond(503, false, 'We could not send your request right now. Please try again shortly.');
    }
    respond(200, true, 'Thank you! We have successfully received your request. Our team will review your information and get back to you shortly.');
} catch (Throwable $error) {
    error_log('PULSO contact error: ' . $error->getMessage());
    respond(500, false, 'We could not process your request right now. Please try again shortly.');
}
