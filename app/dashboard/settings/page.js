/**
 * @fileoverview Settings page
 * @type-check
 */

"use client"

import { useState, useEffect } from "react"
import { createClient } from "../../../lib/supabase/client.js"
import { DashboardHeader } from "../../../components/dashboard/header.tsx"
import { ProfileSettings } from "../../../components/settings/profile-settings.tsx"
import { PipelineSettings } from "../../../components/settings/pipeline-settings.tsx"
import { AccountSettings } from "../../../components/settings/account-settings.tsx"
import { useRouter } from "next/navigation"

/**
 * Settings page component
 * @returns {JSX.Element} Settings page
 */
export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [stages, setStages] = useState([])
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const supabase = createClient()
  const router = useRouter()

  /**
   * Available settings tabs
   */
  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "pipeline", label: "Pipeline", icon: "🔄" },
    { id: "account", label: "Account", icon: "⚙️" },
  ]

  /**
   * Fetches user data and settings
   */
  const fetchData = async () => {
    try {
      // Get user
      const {
        data: { user: userData },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError) throw userError
      setUser(userData)

      // Get pipeline stages
      const { data: stagesData, error: stagesError } = await supabase
        .from("pipeline_stages")
        .select("*")
        .order("position")

      if (stagesError) throw stagesError
      setStages(stagesData || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /**
   * Handles profile update
   * @param {Object} profileData - Profile data
   */
  const handleUpdateProfile = async (profileData) => {
    try {
      // Update profile in profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
      })

      if (profileError) throw profileError

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
        },
      })

      if (metadataError) throw metadataError

      alert("Profile updated successfully!")
      await fetchData() // Refresh user data
    } catch (err) {
      alert("Error updating profile: " + err.message)
    }
  }

  /**
   * Handles pipeline stage update
   * @param {string} stageId - Stage ID
   * @param {Object} stageData - Stage data
   */
  const handleUpdateStage = async (stageId, stageData) => {
    try {
      const { error } = await supabase.from("pipeline_stages").update(stageData).eq("id", stageId)

      if (error) throw error
      await fetchData()
    } catch (err) {
      alert("Error updating stage: " + err.message)
    }
  }

  /**
   * Handles pipeline stage deletion
   * @param {string} stageId - Stage ID
   */
  const handleDeleteStage = async (stageId) => {
    if (!confirm("Are you sure you want to delete this stage? All deals in this stage will need to be moved.")) {
      return
    }

    try {
      const { error } = await supabase.from("pipeline_stages").delete().eq("id", stageId)

      if (error) throw error
      await fetchData()
    } catch (err) {
      alert("Error deleting stage: " + err.message)
    }
  }

  /**
   * Handles pipeline stage creation
   * @param {Object} stageData - Stage data
   */
  const handleCreateStage = async (stageData) => {
    try {
      const maxPosition = Math.max(...stages.map((s) => s.position), -1)

      const { error } = await supabase.from("pipeline_stages").insert([
        {
          ...stageData,
          user_id: user.id,
          position: maxPosition + 1,
        },
      ])

      if (error) throw error
      await fetchData()
    } catch (err) {
      alert("Error creating stage: " + err.message)
    }
  }

  /**
   * Handles password change
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   */
  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      alert("Password changed successfully!")
    } catch (err) {
      alert("Error changing password: " + err.message)
    }
  }

  /**
   * Handles account deletion
   */
  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure? This action cannot be undone.")) {
      return
    }

    try {
      // Note: In a real app, you'd want to handle this server-side
      // to properly clean up all user data
      alert("Account deletion would be handled server-side in production. Contact support for account deletion.")
    } catch (err) {
      alert("Error deleting account: " + err.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <DashboardHeader title="Settings" subtitle="Loading..." />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader title="Settings" subtitle="Manage your account and CRM preferences" />

      <main className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <ProfileSettings user={user} onUpdateProfile={handleUpdateProfile} isLoading={isLoading} />
            )}

            {activeTab === "pipeline" && (
              <PipelineSettings
                stages={stages}
                onUpdateStage={handleUpdateStage}
                onDeleteStage={handleDeleteStage}
                onCreateStage={handleCreateStage}
                isLoading={isLoading}
              />
            )}

            {activeTab === "account" && (
              <AccountSettings
                onChangePassword={handleChangePassword}
                onDeleteAccount={handleDeleteAccount}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
