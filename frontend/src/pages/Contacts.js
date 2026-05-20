import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getContacts, searchContacts, createContact, updateContact, deleteContact } from '../services/api';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', title: ''
    });
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchContacts();
    }, [page]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = search
                ? await searchContacts(search, page)
                : await getContacts(page);
            setContacts(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchContacts();
    };

    const handleSave = async () => {
        try {
            if (selectedContact) {
                await updateContact(selectedContact.id, formData);
            } else {
                await createContact(formData);
            }
            setShowModal(false);
            setFormData({ firstName: '', lastName: '', title: '' });
            setSelectedContact(null);
            fetchContacts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteContact(selectedContact.id);
            setShowDeleteModal(false);
            setSelectedContact(null);
            fetchContacts();
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (contact) => {
        setSelectedContact(contact);
        setFormData({
            firstName: contact.firstName,
            lastName: contact.lastName,
            title: contact.title || ''
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setSelectedContact(null);
        setFormData({ firstName: '', lastName: '', title: '' });
        setShowModal(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Contacts</h2>
                <div>
                    <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/profile')}>
                        Profile
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Search + Add */}
            <div className="d-flex justify-content-between mb-3">
                <form onSubmit={handleSearch} className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-outline-primary">Search</button>
                </form>
                <button className="btn btn-primary" onClick={openCreateModal}>+ Add Contact</button>
            </div>

            {/* Contacts Table */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {contacts.length === 0 ? (
                        <tr><td colSpan="4" className="text-center">No contacts found</td></tr>
                    ) : (
                        contacts.map((c) => (
                            <tr key={c.id}>
                                <td>{c.firstName}</td>
                                <td>{c.lastName}</td>
                                <td>{c.title}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(c)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => { setSelectedContact(c); setShowDeleteModal(true); }}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-outline-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                <span className="align-self-center">Page {page + 1} of {totalPages}</span>
                <button className="btn btn-outline-secondary" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedContact ? 'Edit Contact' : 'Add Contact'}</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">First Name</label>
                                    <input type="text" className="form-control" value={formData.firstName}
                                           onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Last Name</label>
                                    <input type="text" className="form-control" value={formData.lastName}
                                           onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input type="text" className="form-control" value={formData.title}
                                           onChange={(e) => setFormData({...formData, title: e.target.value})} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this contact?
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;