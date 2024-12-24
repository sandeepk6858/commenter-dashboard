import { useState, useEffect } from 'react';
import DefaultLayout from "../../layout/DefaultLayout";
import TableOne from '../../components/Tables/TableOne';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10); // Default limit
  const [lastVisible, setLastVisible] = useState(null); // Track the last document

  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers(currentPage, limit, lastVisible);
  }, [currentPage, limit]);

  const fetchUsers = async (page: any, limit: any, lastVisible: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3012/api/v2/admin/users?page=${page}&limit=${limit}&lastVisible=${lastVisible}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('DATA API RES', response)
      const data = await response.json();
      if (response?.status === 401) {
        toast(`${data?.message}`)
        navigate('/auth/signin')
      }

      if (response?.status === 200) {
        console.log('DATA API RES', data)
        toast(`${data?.message}`)
        setUsers(data.adminUsers);
        setTotalPages(data.totalPages); // Assuming the API returns `totalPages`
        setLastVisible(data.lastDoc); // Update the last document
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: any) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (event: any) => {
    setLimit(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when limit changes
    setLastVisible(null); // Reset last document
  };

  return (
    <div>
      <DefaultLayout>
        <div className='flex justify-between'>
          <h1 className="text-2xl font-bold mb-6">Users</h1>
          <Link
            to="/create/user"
            className="inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Create User
          </Link>
        </div>

        <div className="mb-4">
          <label htmlFor="limit" className="mr-2">Rows per page:</label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="p-2 border rounded-md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TableOne data={users} title='Users List' columns={['Email', 'Current Plan', 'Payment Status', 'Status', 'Payments']} />
        )}

        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </DefaultLayout>
    </div>
  );
};

export default Users
