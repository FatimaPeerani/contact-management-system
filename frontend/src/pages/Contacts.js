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
    const [formData, setFormData] = useState({ firstName: '', lastName: '', title: '' });
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { fetchContacts(); }, [page]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = search ? await searchContacts(search, page) : await getContacts(page);
            setContacts(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => { e.preventDefault(); setPage(0); fetchContacts(); };

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
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        try {
            await deleteContact(selectedContact.id);
            setShowDeleteModal(false);
            setSelectedContact(null);
            fetchContacts();
        } catch (err) { console.error(err); }
    };

    const openEditModal = (contact) => {
        setSelectedContact(contact);
        setFormData({ firstName: contact.firstName, lastName: contact.lastName, title: contact.title || '' });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setSelectedContact(null);
        setFormData({ firstName: '', lastName: '', title: '' });
        setShowModal(true);
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px'}}>
            <div style={{maxWidth: '1100px', margin: '0 auto'}}>

                {/* Header */}
                <div style={{background: 'white', borderRadius: '16px', padding: '20px 28px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
                    <h2 style={{margin: 0, color: '#333', fontWeight: 700}}>📋 My Contacts</h2>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <button onClick={() => navigate('/profile')} style={{padding: '8px 18px', borderRadius: '8px', border: '2px solid #667eea', background: 'white', color: '#667eea', fontWeight: 600, cursor: 'pointer'}}>
                            👤 Profile
                        </button>
                        <button onClick={handleLogout} style={{padding: '8px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: 'white', fontWeight: 600, cursor: 'pointer'}}>
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {/* Search + Add */}
                <div style={{background: 'white', borderRadius: '16px', padding: '20px 28px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
                    <form onSubmit={handleSearch} style={{display: 'flex', gap: '10px'}}>
                        <input
                            type="text"
                            placeholder="🔍 Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '15px', width: '260px', outline: 'none'}}
                        />
                        <button type="submit" style={{padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', fontWeight: 600, cursor: 'pointer'}}>
                            Search
                        </button>
                    </form>
                    <button onClick={openCreateModal} style={{padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '15px'}}>
                        + Add Contact
                    </button>
                </div>

                {/* Table */}
                <div style={{background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
                    {loading ? (
                        <p style={{textAlign: 'center', padding: '40px', color: '#888'}}>Loading...</p>
                    ) : (
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                            <tr style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                                <th style={{padding: '16px 20px', color: 'white', textAlign: 'left', fontWeight: 600}}>First Name</th>
                                <th style={{padding: '16px 20px', color: 'white', textAlign: 'left', fontWeight: 600}}>Last Name</th>
                                <th style={{padding: '16px 20px', color: 'white', textAlign: 'left', fontWeight: 600}}>Title</th>
                                <th style={{padding: '16px 20px', color: 'white', textAlign: 'left', fontWeight: 600}}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {contacts.length === 0 ? (
                                <tr><td colSpan="4" style={{textAlign: 'center', padding: '40px', color: '#888'}}>No contacts found</td></tr>
                            ) : (
                                contacts.map((c, i) => (
                                    <tr key={c.id} style={{borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa'}}>
                                        <td style={{padding: '14px 20px'}}>{c.firstName}</td>
                                        <td style={{padding: '14px 20px'}}>{c.lastName}</td>
                                        <td style={{padding: '14px 20px'}}>{c.title}</td>
                                        <td style={{padding: '14px 20px', display: 'flex', gap: '8px'}}>
                                            <button onClick={() => openEditModal(c)} style={{padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#f59e0b', color: 'white', fontWeight: 600, cursor: 'pointer'}}>Edit</button>
                                            <button onClick={() => { setSelectedContact(c); setShowDeleteModal(true); }} style={{padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 600, cursor: 'pointer'}}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    <div style={{padding: '16px', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center'}}>
                        <button disabled={page === 0} onClick={() => setPage(page - 1)} style={{padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #667eea', background: page === 0 ? '#f0f0f0' : 'white', color: page === 0 ? '#aaa' : '#667eea', cursor: page === 0 ? 'not-allowed' : 'pointer', fontWeight: 600}}>Previous</button>
                        <span style={{color: '#666'}}>Page {page + 1} of {totalPages}</span>
                        <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} style={{padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #667eea', background: page >= totalPages - 1 ? '#f0f0f0' : 'white', color: page >= totalPages - 1 ? '#aaa' : '#667eea', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', fontWeight: 600}}>Next</button>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                    <div style={{background: 'white', borderRadius: '16px', width: '460px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
                        <div style={{background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h5 style={{margin: 0, color: 'white', fontWeight: 700}}>{selectedContact ? '✏️ Edit Contact' : '➕ Add Contact'}</h5>
                            <button onClick={() => setShowModal(false)} style={{background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer'}}>×</button>
                        </div>
                        <div style={{padding: '24px'}}>
                            {['firstName', 'lastName', 'title'].map((field) => (
                                <div key={field} style={{marginBottom: '16px'}}>
                                    <label style={{display: 'block', marginBottom: '6px', fontWeight: 600, color: '#555', textTransform: 'capitalize'}}>{field === 'firstName' ? 'First Name' : field === 'lastName' ? 'Last Name' : 'Title'}</label>
                                    <input type="text" value={formData[field]} onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                                           style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '15px', outline: 'none'}} />
                                </div>
                            ))}
                        </div>
                        <div style={{padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f0f0f0'}}>
                            <button onClick={() => setShowModal(false)} style={{padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #ddd', background: 'white', color: '#666', fontWeight: 600, cursor: 'pointer'}}>Cancel</button>
                            <button onClick={handleSave} style={{padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', fontWeight: 600, cursor: 'pointer'}}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
                    <div style={{background: 'white', borderRadius: '16px', width: '400px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'}}>
                        <div style={{background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', padding: '20px 24px'}}>
                            <h5 style={{margin: 0, color: 'white', fontWeight: 700}}>🗑️ Confirm Delete</h5>
                        </div>
                        <div style={{padding: '24px', color: '#555'}}>Are you sure you want to delete this contact?</div>
                        <div style={{padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f0f0f0'}}>
                            <button onClick={() => setShowDeleteModal(false)} style={{padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #ddd', background: 'white', color: '#666', fontWeight: 600, cursor: 'pointer'}}>Cancel</button>
                            <button onClick={handleDelete} style={{padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: 'white', fontWeight: 600, cursor: 'pointer'}}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contacts;