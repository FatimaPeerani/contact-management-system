import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, changePassword } from '../services/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getUserProfile();
            setUser(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChangePassword = async () => {
        try {
            setError('');
            await changePassword(passwordData);
            setSuccess('Password changed successfully!');
            setShowModal(false);
            setPasswordData({ oldPassword: '', newPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password!');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Profile</h2>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/contacts')}>
                    Back to Contacts
                </button>
            </div>

            {success && <div className="alert alert-success">{success}</div>}

            {user && (
                <div className="card shadow p-4" style={{maxWidth: '500px'}}>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-warning" onClick={() => setShowModal(true)}>
                            Change Password
                        </button>
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Change Password</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div className="mb-3">
                                    <label className="form-label">Old Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleChangePassword}>Reset</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;