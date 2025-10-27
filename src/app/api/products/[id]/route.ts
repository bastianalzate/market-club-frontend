import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    
    if (!productId) {
      return NextResponse.json(
        { error: 'ID de producto requerido' },
        { status: 400 }
      );
    }

    // URL del backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const apiUrl = `${backendUrl}/api/products/${productId}`;
    
    console.log('🔍 Fetching product from:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Error al obtener el producto' },
        { status: response.status }
      );
    }

    const product = await response.json();
    return NextResponse.json(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
