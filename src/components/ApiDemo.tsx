import { userApi, productApi } from '@/api'
import { useState } from 'react'
import type { User, Product } from '@/types/mock'
function ApiDemo() {
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await userApi.getList(1, 10)
      setUsers(res.data?.list || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }
  const fetchUser = async (id: string) => {
    setLoading(true)
    try {
      const res = await userApi.getById(id)
      setUser(res.data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await productApi.getList(1, 10)
      setProducts(res.data?.list || [])
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => fetchUser('1')} disabled={loading} style={{ marginBottom: '20px' }}>
        get User
      </button>
      {loading && <p style={{ color: 'blue' }}>Loading...</p>}
      {!loading && user && (
        <div style={{ marginBottom: '20px' }}>
          <h2>User Details</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </div>
      )}
      <div style={{ marginBottom: '20px' }}>
        <h2>Users API</h2>
        <button onClick={fetchUsers} disabled={loading} style={{ marginRight: '10px' }}>
          Fetch Users
        </button>
        <button
          onClick={() =>
            userApi.create({
              name: 'New User',
              email: 'new@test.com',
              phone: '13800138000',
              avatar: '',
              role: 'user',
              status: 'active',
              createdAt: '',
            })
          }
        >
          Create User
        </button>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} - {u.email}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Products API</h2>
        <button onClick={fetchProducts} disabled={loading}>
          Fetch Products
        </button>
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.name} - ${p.price}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default ApiDemo
