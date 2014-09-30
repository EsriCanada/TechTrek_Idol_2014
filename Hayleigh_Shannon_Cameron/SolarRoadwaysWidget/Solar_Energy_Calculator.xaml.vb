Imports System
Imports System.Collections.Generic
Imports System.Linq
Imports System.Text
Imports System.Threading
Imports System.Threading.Tasks
Imports System.Windows
Imports System.Windows.Controls
Imports System.ComponentModel
Imports System.ComponentModel.Composition
Imports System.Runtime.CompilerServices
Imports System.Runtime.Serialization
Imports ESRI.ArcGIS.OperationsDashboard
Imports client = ESRI.ArcGIS.Client

''' <summary>
''' A Widget is a dockable add-in class for Operations Dashboard for ArcGIS that implements IWidget. By returning true from CanConfigure, 
''' this widget provides the ability for the user to configure the widget properties showing a settings Window in the Configure method.
''' By implementing IDataSourceConsumer, this widget indicates it requires a DataSource to function and will be notified when the 
''' data source is updated or removed.
''' </summary>
<Export("ESRI.ArcGIS.OperationsDashboard.Widget"),
  ExportMetadata("DisplayName", "Solar Roadways Energy Calculator"),
  ExportMetadata("Description", "A Widget that calculates the ~ amount of solar energy a selected set of roads would produce if converted to solar roadway technology."),
  ExportMetadata("ImagePath", "/SolarRoadwaysWidget;component/Images/Widget32.png"),
  ExportMetadata("DataSourceRequired", True),
  DataContract()>
Public Class Solar_Energy_Calculator
  Inherits UserControl
  Implements IWidget, IDataSourceConsumer

  ''' <summary>
  ''' A unique identifier of a data source in the configuration. This property is set during widget configuration.
  ''' </summary>
  <DataMember(Name:="dataSourceId")>
  Public Property DataSourceId As String
    ''' <summary>
    ''' The name of the length field within the selected data source. This property is set during widget configuration.
    ''' </summary>
  <DataMember(Name:="field")> _
  Public Property FieldName() As String
    Get
      Return m_FieldName
    End Get
    Set(value As String)
      m_FieldName = value
    End Set
  End Property
  Private m_FieldName As String

  Private Property Field() As client.Field
    Get
      Return m_Field
    End Get
    Set(value As client.Field)
      m_Field = value
    End Set
  End Property
  Private m_Field As client.Field

    <DataMember(Name:="value")> _
    Public Property Value() As String
        Get
            Return m_Value
        End Get
        Set(value As String)
            m_Value = value
        End Set
    End Property
    Private m_Value As String

    Private Property QueryValue() As String
        Get
          Return m_QueryValue
        End Get
        Set(value As String)
          m_QueryValue = value
        End Set
    End Property
    Private m_QueryValue As String

  Private Sub UpdateControls()

  End Sub

  Private _caption As String = "Default Caption"
  ''' <summary>
  ''' The text that is displayed in the widget's containing window title bar. This property is set during widget configuration.
  ''' </summary>
  <DataMember(Name:="caption")>
  Public Property Caption As String Implements IWidget.Caption
    Get
      Return _caption
    End Get
    Set(value As String)
      _caption = value
    End Set
  End Property

  ''' <summary>
  ''' The unique identifier of the widget, set by the application when the widget is added to the configuration.
  ''' </summary>
  <DataMember(Name:="id")>
  Public Property Id As String Implements IWidget.Id

  ''' <summary>
  ''' OnActivated is called when the widget is first added to the configuration, or when loading from a saved configuration, after all 
  ''' widgets have been restored. Saved properties can be retrieved, including properties from other widgets.
  ''' Note that some widgets may have properties which are set asynchronously and are not yet available.
  ''' </summary>
  ''' <remarks></remarks>
  Public Sub OnActivated() Implements IWidget.OnActivated
    UpdateControls()
  End Sub

  ''' <summary>
  ''' OnDeactivated is called before the widget is removed from the configuration.
  ''' </summary>
  Public Sub OnDeactivated() Implements IWidget.OnDeactivated

  End Sub

  ''' <summary>
  '''  Determines if the Configure method is called after the widget is created, before it is added to the configuration. Provides an opportunity to gather user-defined settings.
  ''' </summary>
  ''' <value>Return true if the Configure method should be called, otherwise return false.</value>
  Public ReadOnly Property CanConfigure As Boolean Implements IWidget.CanConfigure
    Get
      Return True
    End Get
  End Property

  ''' <summary>
  ''' Provides functionality for the widget to be configured by the end user through a dialog.
  ''' </summary>
  ''' <param name="owner">The application window which should be the owner of the dialog.</param>
  ''' <param name="dataSources">The complete list of DataSources in the configuration.</param>
  ''' <returns>True if the user clicks ok, otherwise false.</returns>
  Public Function Configure(owner As Window, dataSources As IList(Of ESRI.ArcGIS.OperationsDashboard.DataSource)) As Boolean Implements IWidget.Configure

    ' Show the configuration dialog.
    Dim dialog As Config.Solar_Energy_CalculatorDialog = New Config.Solar_Energy_CalculatorDialog(dataSources, Caption, DataSourceId, FieldName)
    dialog.Owner = owner

    If (Not dialog.ShowDialog() = True) Then
      Return False
    End If

    ' Retrieve the selected values for the properties from the configuration dialog.
    Caption = dialog.Caption
    DataSourceId = dialog.DataSource.Id
    FieldName = dialog.Field.Name

    ' The default UI simply shows the values of the configured properties.
    UpdateControls()

    Return True

  End Function


  ''' <summary>
  '''  Returns the ID(s) of the data source(s) consumed by the widget.
  ''' </summary>
  Public ReadOnly Property DataSourceIds As String() Implements IDataSourceConsumer.DataSourceIds

    Get
      Dim ids() As String = {DataSourceId}
      Return ids
    End Get

  End Property

  ''' <summary>
  ''' Called when a DataSource is removed from the configuration. 
  ''' </summary>
  ''' <param name="dataSource">The DataSource being removed.</param>
  Public Sub OnRemove(dataSource As ESRI.ArcGIS.OperationsDashboard.DataSource) Implements IDataSourceConsumer.OnRemove

    ' Respond to data source being removed.
    DataSourceId = Nothing

  End Sub

  ''' <summary>
  ''' Called when a DataSource found in the DataSourceIds property is updated.
  ''' </summary>
  ''' <param name="dataSource">The DataSource being updated.</param>
  Public Sub OnRefresh(dataSource As ESRI.ArcGIS.OperationsDashboard.DataSource) Implements IDataSourceConsumer.OnRefresh

    ' If required, respond to the update from the selected data source.
    ' Consider using an async method.
    DoQuery(dataSource)
    If blkMeasure.Text = "0" Then
        blkInfo.Text = ""
        exp.IsExpanded = False
        exp.IsEnabled = False
    Else
        exp.IsEnabled = True
    End If
  End Sub

Private Async Sub DoQuery(ds As DataSource)
    ' If the widget is deserialized from saved values, make sure the Field is set from the FieldName.
    If (Field Is Nothing) AndAlso (Not String.IsNullOrEmpty(FieldName)) Then
      Field = ds.Fields.FirstOrDefault(Function(fld) fld.Name = FieldName)
    End If

    ' Get a query value that takes into account coded value domains.
    If String.IsNullOrEmpty(QueryValue) Then
      QueryValue = getqueryvalue(ds)
    End If

    ' Perform a  query on the data source to get the selected features.
    Dim sumQuery As New Query(String.Format("{0} = {1}", FieldName, QueryValue), New String() {FieldName})
    Dim result As QueryResult = Await ds.ExecuteQueryAsync(sumQuery)


    ' Check the returned results.
    If (result IsNot Nothing) AndAlso (result.Features IsNot Nothing) Then
      Dim kwh As Double
      Dim tempKWH As Double
      Dim sqFeet As Double
      Dim rWatts As Double
      Dim nHomes As Double
      Dim nCars As Double

    'loop through features and calculate energy output for each road segment selected
      For Each feature In result.Features
        sqFeet = feature.Attributes(FieldName) * 7.4
        sqFeet = sqFeet * 10.7639
        rWatts = (sqFeet * 230) / 13.4
        tempKWH = (rWatts / 1000) * 1460
        kwh = kwh + tempKWH
        sqFeet = 0
        rWatts = 0
        tempKWH = 0
      Next


    nHomes = kwh / 12000
    nCars = kwh / 22



    'add the total calculated value to the Widget out
        If kwh > 0 Then
            blkMeasure.Text = kwh.ToString("N")
            If radHomes.IsChecked = True And kwh > 0 Then
                nHomes = Math.Round(nHomes, 0)
                blkInfo.Text = "That is enough to power " & nHomes.ToString() & vbNewLine & _
                       " average North American homes for one year!"
                txtAddInfo.Text = "This statistic is based on an average North American household consumption of " & vbNewLine _
                                  & "12,000 kw/h per year (World Energy Council, 2010)"
            ElseIf radCars.IsChecked = True And kwh > 0 Then
                nCars = Math.Round(nCars, 0)
                blkInfo.Text = "That is enough to power " & nCars.ToString() & vbNewLine & _
                                "electric cars for 160.9 km each!"
                txtAddInfo.Text = "This statistic is based on the 'Mini E' which travels ~160.9 km (100 miles) " & vbNewLine _
                                  & "per 22 kwh of electricity."
            End If
        Return
      End If
    End If


     'If no results were returned, clear the count box.
    blkMeasure.Text = "0"
  End Sub

  Private Sub RadioButton1_CheckedChanged(sender As Object, e As EventArgs) Handles radCars.Click, radHomes.Click
    Dim kwh As Double
    kwh = CType(blkMeasure.Text, Double)
    Dim nHomes As Double = kwh / 10000
    Dim nCars As Double = kwh / 22
    If radHomes.IsChecked = True And kwh > 0 Then
       blkInfo.Text = "That is enough to power " & nHomes.ToString("N") & vbNewLine & _
                       " average North American homes for one year!"
       txtAddInfo.Text = "This statistic is based on an average NA household consumption of " & vbNewLine _
                                  & "12,000 kw/h per year (World Energy Council, 2010)"
    ElseIf radCars.IsChecked = True And kwh > 0 Then
        blkInfo.Text = "That is enough to power " & nCars.ToString("N") & vbNewLine & _
                       "electric cars for 160.9 km each!"
        txtAddInfo.Text = "This statistic is based on the 'Mini E' which travels ~160.9 km (100 miles) " & vbNewLine _
                                  & "per 22 kwh of electricity."
    Else
        blkInfo.Text = ""
    End If

  End Sub

  Private Function getqueryvalue(ds As DataSource) As String
    ' check for coded value domains
    If (Field IsNot Nothing) AndAlso (Field.Domain IsNot Nothing) AndAlso (TypeOf Field.Domain Is client.FeatureService.CodedValueDomain) Then
      ' translate coded value domain value into appropriate key to use in the query.
      Dim codeddomain As client.FeatureService.CodedValueDomain = TryCast(Field.Domain, client.FeatureService.CodedValueDomain)
      Dim valuecode As KeyValuePair(Of Object, String) = codeddomain.CodedValues.FirstOrDefault(Function(val) val.Value = Value)
      Dim codedforvalue As String = valuecode.Key.ToString()
      Return codedforvalue
    End If
    Return Value
  End Function

End Class
