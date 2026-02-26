import { useEffect, useState } from 'react'
import { loadCatalogProductById, loadCatalogProducts } from '@/features/catalog'
import type { Product } from '@/types'

type ProductDetailState = {
  product: Product | null
  related: Product[]
  loading: boolean
}

const INITIAL_STATE: ProductDetailState = {
  product: null,
  related: [],
  loading: true,
}

export function useProductDetail(productId: string) {
  const [state, setState] = useState<ProductDetailState>(INITIAL_STATE)

  useEffect(() => {
    let active = true

    const run = async () => {
      setState(INITIAL_STATE)

      const loadedProduct = await loadCatalogProductById(productId)
      if (!active) {
        return
      }

      if (!loadedProduct) {
        setState({ product: null, related: [], loading: false })
        return
      }

      const siblingProducts = await loadCatalogProducts({ category: loadedProduct.categoryId, limit: 8 })
      if (!active) {
        return
      }

      setState({
        product: loadedProduct,
        related: siblingProducts.filter((item) => item.id !== loadedProduct.id).slice(0, 4),
        loading: false,
      })
    }

    void run()

    return () => {
      active = false
    }
  }, [productId])

  return state
}
