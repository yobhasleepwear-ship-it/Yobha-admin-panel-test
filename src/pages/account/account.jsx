import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Edit3, Save, X, Lock, Shield, Key, Smartphone, CheckCircle2, AlertCircle } from "lucide-react";

const AccountPage = () => {

  const [userData, setUserData] = useState({
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 9876543210",
    address: "123, MG Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001"
  });

  const [editingField, setEditingField] = useState(null);
  const [tempData, setTempData] = useState({});
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const startEdit = (field) => {
    setEditingField(field);
    if (field === "address") {
      setTempData({
        address: userData.address,
        city: userData.city,
        state: userData.state,
        pincode: userData.pincode
      });
    } else {
      setTempData({ [field]: userData[field] });
    }
  };

  const saveEdit = () => {
    setUserData({ ...userData, ...tempData });
    setEditingField(null);
    setTempData({});
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempData({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fdfbf9] to-[#faf6f2] pt-4 lg:pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8b5f4b] mb-2">
            My Account
          </h1>
          <p className="text-sm sm:text-base text-[#a2786b]">
            Manage your profile and preferences
          </p>
        </div>

        {/* Grid Layout */}
        <div className="space-y-6 lg:space-y-8">
          
          {/* First Row - Profile Details & Address */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Profile Details Column */}
            <div className="bg-white border border-[#e7bfb3]/20 rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#fdf9f6] to-[#faf6f2] px-5 sm:px-6 py-4 border-b border-[#e7bfb3]/30">
                <h2 className="text-lg sm:text-xl font-bold text-[#8b5f4b] flex items-center gap-2">
                  <User size={20} className="text-[#d9a79a]" />
                  Profile Information
                </h2>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* Name Field */}
                <div className="group">
                  <label className="text-sm font-semibold text-[#7a5650] mb-2 block">Full Name</label>
                  {editingField === "name" ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempData.name || ""}
                        onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-lg border border-[#e7bfb3] focus:border-[#d9a79a] focus:ring-2 focus:ring-[#d9a79a]/10 outline-none"
                      />
                      <button onClick={saveEdit} className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all">
                        <Save size={18} />
                      </button>
                      <button onClick={cancelEdit} className="p-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-[#faf6f2] rounded-lg">
                      <span className="text-[#8b5f4b] font-medium">{userData.name}</span>
                      <button onClick={() => startEdit("name")} className="text-[#d9a79a] hover:text-[#8b5f4b] transition-colors">
                        <Edit3 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Email Field (Non-editable) */}
                <div>
                  <label className="text-sm font-semibold text-[#7a5650] mb-2 block flex items-center gap-2">
                    <Mail size={14} />
                    Email Address
                  </label>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-[#8b5f4b] font-medium">{userData.email}</span>
                    <span className="text-xs text-[#a2786b]">Verified</span>
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="text-sm font-semibold text-[#7a5650] mb-2 block flex items-center gap-2">
                    <Phone size={14} />
                    Phone Number
                  </label>
                  {editingField === "phone" ? (
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={tempData.phone || ""}
                        onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-lg border border-[#e7bfb3] focus:border-[#d9a79a] focus:ring-2 focus:ring-[#d9a79a]/10 outline-none"
                      />
                      <button onClick={saveEdit} className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all">
                        <Save size={18} />
                      </button>
                      <button onClick={cancelEdit} className="p-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-[#faf6f2] rounded-lg">
                      <span className="text-[#8b5f4b] font-medium">{userData.phone}</span>
                      <button onClick={() => startEdit("phone")} className="text-[#d9a79a] hover:text-[#8b5f4b] transition-colors">
                        <Edit3 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Column */}
            <div className="bg-white border border-[#e7bfb3]/20 rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#fdf9f6] to-[#faf6f2] px-5 sm:px-6 py-4 border-b border-[#e7bfb3]/30">
                <h2 className="text-lg sm:text-xl font-bold text-[#8b5f4b] flex items-center gap-2">
                  <MapPin size={20} className="text-[#d9a79a]" />
                  Default Address
                </h2>
              </div>

              <div className="p-5 sm:p-6">
                {editingField === "address" ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Address"
                      value={tempData.address || ""}
                      onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-[#e7bfb3] focus:border-[#d9a79a] focus:ring-2 focus:ring-[#d9a79a]/10 outline-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={tempData.city || ""}
                        onChange={(e) => setTempData({ ...tempData, city: e.target.value })}
                        className="px-4 py-3 rounded-lg border border-[#e7bfb3] focus:border-[#d9a79a] focus:ring-2 focus:ring-[#d9a79a]/10 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={tempData.state || ""}
                        onChange={(e) => setTempData({ ...tempData, state: e.target.value })}
                        className="px-4 py-3 rounded-lg border border-[#e7bfb3] focus:border-[#d9a79a] focus:ring-2 focus:ring-[#d9a79a]/10 outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={tempData.pincode || ""}
                      onChange={(e) => setTempData({ ...tempData, pincode: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-[#e7bfb3] focus:border-[#d9a79a] focus:ring-2 focus:ring-[#d9a79a]/10 outline-none"
                    />
                    <div className="flex gap-3">
                      <button onClick={saveEdit} className="flex-1 bg-gradient-to-r from-[#f6d6cb] to-[#e7bfb3] hover:shadow-lg text-[#8b5f4b] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                        <Save size={18} />
                        Save Address
                      </button>
                      <button onClick={cancelEdit} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="p-4 bg-[#faf6f2] rounded-lg mb-4">
                      <p className="text-[#8b5f4b] font-medium mb-1">{userData.address}</p>
                      <p className="text-[#7a5650]">{userData.city}, {userData.state} - {userData.pincode}</p>
                    </div>
                    <button 
                      onClick={() => startEdit("address")} 
                      className="w-full bg-gradient-to-r from-[#f6d6cb] to-[#e7bfb3] hover:shadow-lg text-[#8b5f4b] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Edit3 size={18} />
                      Edit Address
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Second Row - Security Card (Full Width) */}
          <div className="bg-white border border-[#e7bfb3]/20 rounded-2xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#fdf9f6] to-[#faf6f2] px-5 sm:px-6 py-4 border-b border-[#e7bfb3]/30">
              <h2 className="text-lg sm:text-xl font-bold text-[#8b5f4b] flex items-center gap-2">
                <Shield size={20} className="text-[#d9a79a]" />
                Security & Privacy
              </h2>
              <p className="text-xs sm:text-sm text-[#a2786b] mt-1">Keep your account safe and secure</p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="space-y-6">
                
                {/* First Row - Password & Two-Factor Auth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Change Password */}
                  <div className="bg-gradient-to-br from-[#faf6f2] to-[#fef9f5] rounded-xl p-5 border border-[#e7bfb3]/30 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-white rounded-lg shadow-sm">
                        <Key size={20} className="text-[#d9a79a]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#8b5f4b] text-sm">Password</h3>
                        <p className="text-xs text-[#a2786b]">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-[#f6d6cb] to-[#e7bfb3] hover:shadow-lg text-[#8b5f4b] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 mt-auto">
                      <Lock size={18} />
                      Change Password
                    </button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-gradient-to-br from-[#faf6f2] to-[#fef9f5] rounded-xl p-5 border border-[#e7bfb3]/30 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-white rounded-lg shadow-sm">
                        <Smartphone size={20} className="text-[#d9a79a]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#8b5f4b] text-sm">Two-Factor Auth</h3>
                        <p className="text-xs text-[#7a5650]">Extra security layer</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-[#7a5650] font-medium">
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button 
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          twoFactorEnabled 
                            ? 'bg-gradient-to-r from-green-400 to-green-500' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                          twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Second Row - Account Status & Security Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account Security Status */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 h-full">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle2 size={20} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800 text-sm mb-1">Account Secured</h3>
                        <p className="text-xs text-green-600 leading-relaxed">Your account is protected with strong security measures</p>
                      </div>
                    </div>
                  </div>

                  {/* Security Tips */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 h-full">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <AlertCircle size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-800 text-sm mb-1">Security Tip</h3>
                        <p className="text-xs text-blue-600 leading-relaxed">Use a strong password with at least 8 characters, including numbers and symbols</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountPage;

