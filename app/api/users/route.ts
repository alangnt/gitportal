import { NextRequest, NextResponse } from 'next/server';
import { usersCollection, projectsCollection } from '@/app/actions';
import { auth } from '@/auth';

type BaseUser = {
  name: string;
  email: string;
  image: string;
  createdAt?: Date;
}

// TODO: Add Zod validation schemas

/**
 * Get User by Email
 * @returns currently connected User
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) return NextResponse.json({ 
      message: 'unauthorized', 
      status: 401 
    });

    const user = await usersCollection.findOne(
      { email: session.user.email },
      {
        projection: {
          password: 0,
        },
      }
    );

    if (!user) {
      return NextResponse.json({ 
        message: 'user-not-found',
        status: 404
      });
    }

    return NextResponse.json({ 
      data: user,
      status: 200
    });
  } catch (error) {
    return NextResponse.json({
      message: 'failed-fetching-user',
      error: error,
      status: 500 
    });
  }
}

/**
 * Create User
 * @param req body: name, email and image
 * @returns 200
 */
export async function POST(req: NextRequest) {
	try {
		const { name, email, image }: BaseUser = await req.json();
		
    // Checks if User already exists in the DB
		const existingUser = await usersCollection.findOne({email});
		if (existingUser) return NextResponse.json({ 
      message: "user-already-exists", 
      status: 409 
    });
		
		const newUser: BaseUser = { name, email, image, createdAt: new Date() };
		
		const result = await usersCollection.insertOne(newUser);
		
    if (!result) return NextResponse.json({ 
      message: "error-creating-user", 
      status: 400 
    });

		return NextResponse.json({ 
      message: "user-created", 
      status: 201
    });
	} catch (error) {
		return NextResponse.json({
      message: "failed-creating-user",
      error: error,
      status: 500
    });
	}
}

/**
 * Delete User by Email
 * @returns 200
 */
export async function DELETE() {
	try {
    const session = await auth();

    if (!session?.user?.email) return NextResponse.json({ 
      message: 'unauthorized', 
      status: 401 
    });
    
		const result = await usersCollection.deleteOne({ email: session.user.email });
		
    // Delete all projects from the User
    // TODO: Not by Email
		await projectsCollection.deleteMany({ email: session.user.email });
		
    // TODO: Also delete the likes and bookmarks
		
    if (!result) return NextResponse.json({
      message: "error-deleting-user",
      status: 400
    });

		return NextResponse.json({
      message: "user-deleted",
      status: 200
    });
	} catch (error) {
		return NextResponse.json({
      message: "Internal server error",
      error: error,
      status: 500
    });
	}
}

/**
 * Edit User by Email
 * @param req body: username, bio, location, website, twitter, github
 * @returns 200
 */
export async function PATCH(req: NextRequest) {
	try {
    const session = await auth();
    
    if (!session?.user?.email) return NextResponse.json({ 
      message: 'unauthorized', 
      status: 401 
    });

    // TODO: Send an entire body instead
		const { bio, location, website, twitter, github } = await req.json();

    const body = {
      bio,
      location,
      website,
      twitter,
      github
    }
		
		const result = await usersCollection.updateOne(
			{ email: session.user.email },
			{ $set: body }
		);
		
		if (!result) return NextResponse.json({
      message: "error-updating-user",
      status: 400
    });
		
		return NextResponse.json({
      message: "user-updated",
      status: 200
    });
	} catch (error) {
  return NextResponse.json({
    message: "failed-updating-user",
    error: error,
    status: 500
  });
	}
}