"use client";

import { Plus } from "lucide-react";

export default function ProductSelectionFlow() {
  return (
    <section className="py-20 bg-white">
      <div className="px-8 mx-auto max-w-7xl sm:px-12 lg:px-16">
        {/* Título de la sección */}
        <div className="text-center mb-20">
          <h2 className="text-[30px] font-bold leading-tight text-black sm:text-5xl lg:text-6xl mb-6">
            Construye tu regalo
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            Seleccioná los productos que quieras incluir en tu regalo
            personalizado
          </p>
        </div>

        {/* Flujo de selección de productos */}
        <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-4 xl:space-x-6">
          {/* Primer slot de producto - Filled */}
          <div className="flex flex-col items-center">
            <div className="w-64 h-[415px] bg-amber-600 rounded-[18px] flex items-center justify-center shadow-xl mb-4">
              <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <Plus className="w-12 h-12 text-black" />
              </div>
            </div>
            <p className="text-sm font-bold text-amber-600 uppercase tracking-wider text-center">
              Agregá tu producto
            </p>
          </div>

          {/* Primer conector */}
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Segundo slot de producto - Empty */}
          <div className="flex flex-col items-center">
            <div className="w-64 h-[415px] border-3 border-dashed border-gray-300 rounded-[18px] flex items-center justify-center shadow-sm bg-gray-50 mb-4">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center px-6">
                Agregá tu producto
              </p>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center">
              Agregá tu producto
            </p>
          </div>

          {/* Segundo conector */}
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Tercer slot de producto - Empty */}
          <div className="flex flex-col items-center">
            <div className="w-64 h-[415px] border-3 border-dashed border-gray-300 rounded-[18px] flex items-center justify-center shadow-sm bg-gray-50 mb-4">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center px-6">
                Agregá tu producto
              </p>
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center">
              Agregá tu producto
            </p>
          </div>

          {/* Signo igual */}
          <div className="flex justify-center">
            <div className="text-5xl font-bold text-gray-400">=</div>
          </div>

          {/* Resumen del carrito */}
          <div className="flex flex-col items-center">
            <div className="w-64 h-[415px] bg-white rounded-[18px] p-6 flex flex-col justify-between shadow-xl border border-gray-100">
              {/* Información del subtotal */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-700">
                    Subtotal
                  </span>
                  <span className="text-lg font-bold text-black">$0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-700">
                    Descuentos totales
                  </span>
                  <span className="text-lg font-bold text-red-500">-$0</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-black">$0</span>
                  </div>
                </div>
              </div>

              {/* Botón de agregar al carrito */}
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105">
                <Plus className="w-5 h-5" />
                <span className="text-base">Agregar al carrito</span>
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-base">
            Haz clic en cada slot para agregar productos a tu regalo
            personalizado
          </p>
        </div>
      </div>
    </section>
  );
}
