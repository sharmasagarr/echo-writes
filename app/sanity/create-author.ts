import { client } from './lib/client'
import { writeClient } from './lib/write-client';
import axios from 'axios';

async function uploadImageToSanity(imageUrl: string) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data, 'binary');

    const asset = await writeClient.assets.upload('image', buffer, {
      contentType: response.headers['content-type'],
      filename: 'avatar.jpg',
    });

    return asset._id;
  } catch (err) {
    console.error('Image upload failed:', err);
    return null;
  }
}
  
export async function createAuthorInSanity(user: {
  name?: string;
  email?: string;
  image: string | null;
  id?: string;
  username?: string;
}) {
  if (!user?.email) return;

  const existing = await client.fetch(
    `*[_type == "author" && email == $email][0]`,
    { email: user.email }
  );

  if (existing) return;

  // Uploading the image if available
  let imageRef;
  if (user.image) {
    const assetId = await uploadImageToSanity(user.image);
    if (assetId) {
      imageRef = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assetId,
        },
      };
    }
  }

  // Creating the author document
  await writeClient.create({
    _type: 'author',
    name: user.name ?? 'Anonymous',
    username: user.username,
    email: user.email,
    _id: user.id,
    image: imageRef,
    bio: 'Hey there! I am a new author on echo-writes. Stay tuned for my posts!',
  });
}